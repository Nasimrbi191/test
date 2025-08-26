import '../../styles/Login.scss'
import { Button, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next';
import { Field, Form } from 'react-final-form';
import { useAuth } from '../../Hooks/useAuth';
import { useLogin } from '../../Hooks/useLogin';


function Login() {
    const required = (value: string) => (value ? undefined : "Required");
    const { t } = useTranslation();
    const { setToken, setRefreshToken, setUserInfo } = useAuth();
    const loginMutation = useLogin({setToken, setRefreshToken, setUserInfo});
    const handleSubmit = async (values: any) => {
       loginMutation.mutate(values);
    };
    return (
        <div
            style={{
                backgroundColor: "#F5F8FA",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="form-login-wrapper">
                <Form
                    onSubmit={handleSubmit}
                    render={({ handleSubmit, submitting, pristine }) => (
                        <form onSubmit={handleSubmit}>
                            <Field name="Email" validate={required}>
                                {({ input, meta }) => (
                                    <TextField
                                        {...input}
                                        label={t("Email")}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            </Field>
                            <Field name="Password" validate={required}>
                                {({ input, meta }) => (
                                    <TextField
                                        {...input}
                                        type="Password"
                                        label={t("Password")}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            </Field>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={submitting || pristine}
                            >
                                {t("login")}
                            </Button>
                        </form>
                    )}
                />
            </div>
        </div>
    );
}

export default Login;
