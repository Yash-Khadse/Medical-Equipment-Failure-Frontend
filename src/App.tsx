import React, { useState } from "react";
import PredictionForm from "./components/PredictionForm";
import PredictionResultDisplay from "./components/PredictionResultDisplay";
import { FormData, PredictionResult } from "./types";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box,
  Card,
  CardContent,
  Collapse,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

// A simple theme for a consistent look and feel
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<number>(0); // New state for form key

  const handlePredict = async (form: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Simulate API call delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: PredictionResult & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "An unknown prediction error occurred.");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || "Network error or server unavailable.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
    setFormKey((prevKey) => prevKey + 1); // Increment key to reset form
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <MedicalServicesIcon
                color="primary"
                sx={{ fontSize: 40, mr: 1 }}
              />
              <Typography variant="h4" component="h1" fontWeight="bold">
                Medical Device Recall
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              gutterBottom
            >
              Enter device details to predict recall classification.
            </Typography>

            <PredictionForm key={formKey} onPredict={handlePredict} loading={loading} />

            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
                <CircularProgress />
              </Box>
            )}

            <Collapse in={!!error}>
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            </Collapse>

            <Collapse in={!!result}>
              {result && (
                <Box sx={{ mt: 3 }}>
                  <PredictionResultDisplay result={result} />
                  <Button
                    variant="outlined"
                    onClick={handleClear}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Start New Prediction
                  </Button>
                </Box>
              )}
            </Collapse>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
