import { Button, MenuItem, Paper, TextField, Typography, Grid, Grid2 } from "@mui/material";
import { Formik, Form, Field } from "formik";
import React from "react";

export const SearchBarDinamico = ({ filters = [], onSearch, title = "Búsqueda" }) => {
  // valores iniciales dinámicos
  const initialValues = filters.reduce((acc, filter) => {
    acc[filter.name] = "";
    return acc;
  }, {});

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      {/* Encabezado */}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          onSearch(values); // delega al padre
        }}
      >
        {({ values, handleChange, resetForm }) => (
          <Form>
            <Grid container spacing={2} alignItems="center">
              {filters.map((filter) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={filter.name}>
                  {filter.type === "select" ? (
                    <TextField
                      select
                      fullWidth
                      name={filter.name}
                      label={filter.label}
                      value={values[filter.name]}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        "& .MuiSelect-select": {
                          padding: "12px 16px",
                          fontFamily: "Praxis Next, sans-serif",
                          fontSize: "1rem",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1E1E1E",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#dc3545",
                        },
                      }}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {filter.options?.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <Field
                      as={TextField}
                      fullWidth
                      name={filter.name}
                      label={filter.label}
                      size="small"
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "12px 16px",
                          fontFamily: "Praxis Next, sans-serif",
                          fontSize: "1rem",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1E1E1E",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#dc3545",
                        },
                      }}
                    />
                  )}
                </Grid>
              ))}

              {/* Botones */}
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="button primary-button"
                >
                  Buscar
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  type="button"
                  fullWidth
                  variant="outlined"
                  className="button secondary-button"
                  onClick={() => {
                    resetForm();
                    onSearch(initialValues);
                  }}
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};
