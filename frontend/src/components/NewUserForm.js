import { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import {LOCAL_URL} from '../constants';
import '../styles/styles.css';

function NewUserForm(props) {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [selectOption, setSelectOption] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleSelectChange = (e) => {
        setSelectOption(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', url);
        formData.append('resume', file);
        formData.append('theme', selectOption);
        console.log(selectOption);
        console.log(url);
        setIsLoading(true);

        try {
            const response = await fetch(`${LOCAL_URL}/gemini`, {
                method: 'POST',
                body: formData,
                // mode: 'no-cors'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Form submission successful', result);
        } catch (error) {
            console.error('Form submission error:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    


    return (
    <>
    <div className="inner-container">
        <div className="container">
            <Form onSubmit={handleSubmit}>
                <Form.Label htmlFor="basic-url" className="sep">Your Personal Website URL</Form.Label>
                <InputGroup className="mb-3 sep">
                    <InputGroup.Text id="basic-addon3">
                    https://resu-me.com/&nbsp;
                    </InputGroup.Text>
                    <Form.Control 
                        id="basic-url" 
                        aria-describedby="basic-addon3" 
                        onChange={handleUrlChange}
                        />
                </InputGroup>

                
                <Form.Group controlId="formFileSm" className="mb-3 sep">
                    <Form.Label>Upload your resume below:</Form.Label>
                    <Form.Control 
                        type="file" 
                        size="sm"
                        onChange={handleFileChange} 
                        />
                </Form.Group>

                <Form.Select 
                    aria-label="Default select example"
                    onChange={handleSelectChange}
                    >
                    <option>Select your theme</option>
                    <option value="Apple">Apple</option>
                    <option value="Minimalistic">Minimalistic</option>
                    <option value="Newspaper">Newspaper</option>
                    <option value="Tumblr">Tumblr</option>
                    <option value="WindowsXP">WindowsXP</option>
                    <option value="Vaporwave">Vaporwave</option>
                </Form.Select>
                <Button variant="primary" type="submit">
                    {isLoading ? (<Spinner animation="border" role="status" size="sm" />) : 
            (
                'Submit'
            )}
                  </Button>
            </Form>
        </div>
    </div>
    </>
    )
}

export default NewUserForm;