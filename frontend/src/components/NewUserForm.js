import { useState, useEffect } from "react";
import Uploader from "./Uploader";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import {LOCAL_URL} from '../constants';

function NewUserForm(props) {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [selectOption, setSelectOption] = useState('');

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

        try {
            const response = await fetch(`${LOCAL_URL}/gemini`, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Form submission successful', result);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };
    


    return (
    <>
    <Form onSubmit={handleSubmit}>
        <Form.Label htmlFor="basic-url">Your vanity URL</Form.Label>
        <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon3">
            https://resu-me.com/
            </InputGroup.Text>
            <Form.Control 
                id="basic-url" 
                aria-describedby="basic-addon3" 
                onChange={handleUrlChange}
                />
        </InputGroup>

      
        <Form.Group controlId="formFileSm" className="mb-3">
            <Form.Label>Small file input example</Form.Label>
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
            <option>Open this select menu</option>
            <option value="theme1">One</option>
            <option value="theme1">Two</option>
            <option value="theme1">Three</option>
        </Form.Select>
        <Button variant="primary" type="submit">
            Submit
      </Button>
    </Form>
    </>
    )
}

export default NewUserForm;