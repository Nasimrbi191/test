import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Form, Field } from "react-final-form";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "../../styles/Contact.scss";
import Header from "../../components/Header/Header";

function Contact() {
  const required = (value: string) => (value ? undefined : "Required");
  const isEmailValidate = (value: string) =>
    value && !/\S+@\S+\.\S+/.test(value) ? "Invalid email address" : undefined;

  const onSubmit = (values: any) => {
    console.log("Form Submitted:", values);
  };

  return (
    <>
      <Navbar />
      <Header />
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Contact Us
          </Typography>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit} className="contact-form">
                {/* Name */}
                <Field name="name" validate={required}>
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      label="Name"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>

                {/* Email */}
                <Field name="email" validate={isEmailValidate}>
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>

                {/* Message */}
                <Field name="message" validate={required}>
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      label="Message"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>

                {/* Submit button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "16px",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ width: "50%" }}
                    color="primary"
                    disabled={submitting || pristine}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            )}
          />
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default Contact;
