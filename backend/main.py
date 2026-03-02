from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import os
import shutil
import uuid

app = FastAPI(title="DocLens Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from typing import Optional

@app.post("/upload")
async def upload_document(file: UploadFile = File(...), cert_id: Optional[str] = Form(None)):
    allowed_extensions = ('.pdf', '.jpg', '.jpeg', '.png', '.webp', '.doc', '.docx')
    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload a PDF, Image, or Word Document.")
    
    cert_id = cert_id.strip() if cert_id else ""
    owner_name = "Unknown"
    
    # check if cert is valid
    from database import get_db
    db = get_db()
    
    if cert_id:
        cursor = db.execute('SELECT owner_name FROM certificates WHERE id = ?', (cert_id,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Certificate ID not found")
            
        owner_name = row['owner_name']
    else:
        # mock a fake user if no cert provided
        cert_id = "UNVERIFIED"
        try:
            db.execute('''
                INSERT INTO certificates (id, owner_name, issue_date) 
                VALUES (?, ?, ?)
            ''', (cert_id, "Unknown Upload", "N/A"))
            db.commit()
        except Exception:
            pass
        
    # Save file locally
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_location = os.path.join("uploads", unique_filename).replace("\\", "/")
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
        
    # run the model
    from analysis import analyze_document
    analysis_results = analyze_document(file_location)
    
    ocr_data = analysis_results.get("ocr_data", "")
    risk_score = analysis_results.get("risk_score", 0)
    risk_level = analysis_results.get("risk_level", "Low")
    ela_path = analysis_results.get("forensics", {}).get("ela", {}).get("ela_path", "")
        
    # Save to sqlite
    db.execute('''
        INSERT INTO uploaded_documents 
        (cert_id, file_name, file_path, ocr_data, risk_score, risk_level, ela_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (cert_id, file.filename, f"/{file_location}", ocr_data, risk_score, risk_level, ela_path))
    db.commit()
        
    return {
        "message": "File verified and stored successfully",
        "filename": file.filename,
        "certificate_owner": owner_name,
        "file_url": f"/{file_location}",
        "analysis": analysis_results
    }

@app.get("/documents")
def get_documents():
    from database import get_db
    db = get_db()
    
    cursor = db.execute('''
        SELECT d.*, c.owner_name 
        FROM uploaded_documents d
        LEFT JOIN certificates c ON d.cert_id = c.id
        ORDER BY d.upload_timestamp DESC
    ''')
    
    records = []
    for row in cursor.fetchall():
        records.append(dict(row))
        
    return records

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
