import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';

function Uploader({fileSetter}) {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isOverBox, setIsOverBox] = useState(false);

    /**
     * Handles when mouse is over box 
     */
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsOverBox(true);
    }

    /**
     * Handles when mouse leaves box
     */
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsOverBox(false);
    }

    /**
     * Handle dropping, same as submission
     */
    const handleDrop = (e) =>{ 
        e.preventDefault();
        setIsOverBox(false);

        const file = e.dataTransfer.files[0];
        const num_files = e.dataTransfer.files.length;

        if (file && file.type === 'application/pdf' && num_files < 2) {
            setUploadedFile(file.name);
            const data = new FormData();
            data.append('pdf', file);
            const pdf = data.get("pdf");
    
            let reader = new FileReader();
            reader.onload = function(event) {
                fileSetter(new Uint8Array(event.target.result));
            }
    
            reader.readAsArrayBuffer(pdf);
        }
    }

    /**
     * Handles submission via choose file. Automatically loads
     */
    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const pdfFile = e.target.files[0];
        formData.append("pdf",pdfFile)

        let reader = new FileReader();
        reader.onload = function(event) {
            fileSetter(new Uint8Array(event.target.result));
        }

        reader.readAsArrayBuffer(pdfFile);
    }


    return (
        <>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
                style={{
                border: '2px dashed #ccc',
                background: `rgba(211,255,191,${isOverBox? '0.5': '0'})`,
                padding: '20px',
                margin: '20px',
                textAlign: 'center',
                }}
            >
            <p>Drag file here</p>
            {uploadedFile && (
                <div>
                    <h3>File uploaded: </h3>
                    <p>
                        {uploadedFile}
                    </p>
                </div>
            )}
            </div>
            
        </div>
        </>
    )
}

export default Uploader;