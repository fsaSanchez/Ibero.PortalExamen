
import React from "react";
import { IconIbero } from "../ui/components/icons/IconIbero";
import { Form, Formik } from "formik";
import { InputControl } from "../ui/components/controls";

export const SearchBar = ({
    onSubmit,
    onChange,
    placeholder = 'Buscar',
    label = 'Buscar:'
}) => {
    
    const handleSubmit = (values) => {
        onSubmit(values.query);
    }

    const handleOnChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <Formik
            onSubmit={(values) => {handleSubmit(values)}}
            initialValues={{query: ''}}
        >
            <Form style={{width: 'fit-content', alignItems: 'end'}} className="d-flex flex-row gap-2" onChange={handleOnChange}>
                <InputControl type="text" className="form-control" placeholder={placeholder} name="query" label={label} />
                {/* <button type="submit" className="button primary-button button-s">Buscar</button> */}
            </Form>
        </Formik>
    );
};