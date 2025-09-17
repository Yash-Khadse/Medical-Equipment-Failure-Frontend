import React, { useState, ChangeEvent, FormEvent, FC } from "react";
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
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";

// --- ICONS ---
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";

// --- THEME AND STYLING ---
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f4f6f8",
    },
    success: { main: "#2e7d32" },
    warning: { main: "#ed6c02" },
    error: { main: "#d32f2f" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// --- TYPE DEFINITIONS (to match backend) ---
interface FormData {
  device_name: string;
  manufacturer_name: string;
  implanted: "Yes" | "No";
  action_type: "Recall" | "Safety Alert" | "Correction";
}

interface PredictionResult {
  Predicted_Final_Recall_Level: string | number | null; // Allow number
  Reason: string;
  Action_Type: string;
  Failure_Details: string;
}

// --- COMPONENTS ---

// --- 1. Prediction Form Component ---
const PredictionForm: FC<{
  onPredict: (form: FormData) => void;
  loading: boolean;
}> = ({ onPredict, loading }) => {
  const [form, setForm] = useState<FormData>({
    device_name: "",
    manufacturer_name: "",
    implanted: "No",
    action_type: "Recall",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value as any });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onPredict(form);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6}>
          <TextField
            label="Device Name"
            name="device_name"
            value={form.device_name}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <TextField
            label="Manufacturer Name"
            name="manufacturer_name"
            value={form.manufacturer_name}
            onChange={handleChange}
            fullWidth
            required
            disabled={loading}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="implanted-label">Implanted Device</InputLabel>
            <Select
              labelId="implanted-label"
              label="Implanted Device"
              name="implanted"
              value={form.implanted}
              onChange={handleChange}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6}>
          <FormControl fullWidth disabled={loading}>
            <InputLabel id="action-type-label">Action Type</InputLabel>
            <Select
              labelId="action-type-label"
              label="Action Type"
              name="action_type"
              value={form.action_type}
              onChange={handleChange}
            >
              <MenuItem value="Recall">Recall</MenuItem>
              <MenuItem value="Safety Alert">Safety Alert</MenuItem>
              <MenuItem value="Correction">Correction</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Predict Classification"
        )}
      </Button>
    </Box>
  );
};

// --- 2. Prediction Result Display Component ---
const PredictionResultDisplay: FC<{ result: PredictionResult }> = ({
  result,
}) => {
  // ✨ FIXED a bug here to handle numbers from backend ✨
  const getChipColor = (
    level: string | number | null
  ): "success" | "warning" | "error" | "default" => {
    if (level === null || level === undefined) return "default"; // First, check if level exists

    const levelStr = String(level); // Safely convert level to a string

    if (levelStr.includes("Class I") || levelStr.includes("1")) return "error";
    if (levelStr.includes("Class II") || levelStr.includes("2"))
      return "warning";
    if (levelStr.includes("Class III") || levelStr.includes("3"))
      return "success";
    return "default";
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2, mt: 3 }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Prediction Complete
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {result.Predicted_Final_Recall_Level && (
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Predicted Recall Level
          </Typography>
          <Chip
            label={String(result.Predicted_Final_Recall_Level)} // Use String() here too for safety
            color={getChipColor(result.Predicted_Final_Recall_Level)}
            sx={{ fontSize: "1.2rem", px: 2, py: 3, mt: 1, fontWeight: "bold" }}
          />
        </Box>
      )}

      <List>
        {result.Reason && (
          <ListItem>
            <ListItemIcon>
              <ErrorOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Reason for Prediction"
              secondary={result.Reason}
            />
          </ListItem>
        )}
        {result.Action_Type && (
          <ListItem>
            <ListItemIcon>
              <PolicyOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Action Type"
              secondary={result.Action_Type}
            />
          </ListItem>
        )}
        {result.Failure_Details && (
          <ListItem>
            <ListItemIcon>
              <BuildOutlinedIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Failure Details / Historical Context"
              secondary={result.Failure_Details}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

// --- 3. MAIN APP COMPONENT ---
function App() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<number>(0);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handlePredict = async (form: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: PredictionResult & { error?: string; details?: string } =
        await res.json();

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
    setFormKey((prevKey) => prevKey + 1);
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
                Medical Device Failure Predictor
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              gutterBottom
            >
              Enter device details to predict its recall classification.
            </Typography>

            <PredictionForm
              key={formKey}
              onPredict={handlePredict}
              loading={loading}
            />

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
                <Box>
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
