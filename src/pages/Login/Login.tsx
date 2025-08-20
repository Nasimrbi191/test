import '../../styles/Login.scss'
import { Button, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next';
import { Field, Form } from 'react-final-form';
import api from '../../instanceAxios/instanceAxios';
import { useAuth } from '../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';


function Login() {
    const required = (value: string) => (value ? undefined : "Required");
    const { t } = useTranslation();
    const { setToken, setRefreshToken , setUserInfo  } = useAuth();
   const navigate = useNavigate();

    const handleSubmit = async (values: any) => {
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("password", values.password);
        try {
            const res = await api.post(
                "/core/Authenticate/login",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            localStorage.setItem("token", res.data.data.loginInfo.token);
            setToken(res.data.data.loginInfo.token);
            setRefreshToken(res.data.data.loginInfo.refreshToken);
            setUserInfo(res.data.data.loginInfo.user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
        }
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
                            <Field name="username" validate={required}>
                                {({ input, meta }) => (
                                    <TextField
                                        {...input}
                                        label={t("username")}
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error}
                                    />
                                )}
                            </Field>
                            <Field name="password" validate={required}>
                                {({ input, meta }) => (
                                    <TextField
                                        {...input}
                                        type="password"
                                        label={t("password")}
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
