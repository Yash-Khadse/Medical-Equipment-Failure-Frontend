import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { motion } from "framer-motion";
import { FormData } from "../types";

interface PredictionFormProps {
  onPredict: (form: FormData) => void;
  loading: boolean;
}

// Animation variants for staggering children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function PredictionForm({
  onPredict,
  loading,
}: PredictionFormProps) {
  const [form, setForm] = useState<FormData>({
    device_name: "",
    manufacturer_name: "",
    implanted: "No", // Default value
    action_type: "Recall", // Default value
  });
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear validation error for the field being changed
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors: Partial<Record<keyof FormData, string>> = {};

    if (!form.device_name.trim()) {
      errors.device_name = "Device Name is required.";
    }
    if (!form.manufacturer_name.trim()) {
      errors.manufacturer_name = "Manufacturer Name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({}); // Clear all errors on successful validation
    onPredict(form);
  };

  return (
    <Box
      component={motion.form}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      sx={{ mt: 3 }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <motion.div variants={itemVariants}>
            <TextField
              label="Device Name"
              name="device_name"
              value={form.device_name}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              error={!!validationErrors.device_name}
              helperText={validationErrors.device_name}
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <motion.div variants={itemVariants}>
            <TextField
              label="Manufacturer Name"
              name="manufacturer_name"
              value={form.manufacturer_name}
              onChange={handleChange}
              fullWidth
              required
              disabled={loading}
              error={!!validationErrors.manufacturer_name}
              helperText={validationErrors.manufacturer_name}
            />
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <motion.div variants={itemVariants}>
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
          </motion.div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <motion.div variants={itemVariants}>
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
          </motion.div>
        </Grid>
      </Grid>
      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 3, py: 1.5, textTransform: "none", fontSize: "1rem" }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Predict Classification"
          )}
        </Button>
      </motion.div>
    </Box>
  );
}
