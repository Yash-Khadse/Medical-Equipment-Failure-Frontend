import React from "react";
import { PredictionResult } from "../types";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";

interface PredictionResultDisplayProps {
  result: PredictionResult;
}

const getChipColor = (level: string | undefined | null) => {
  if (!level || typeof level !== "string") return "default";
  if (level.includes("Class I")) return "error";
  if (level.includes("Class II")) return "warning";
  return "success";
};

const getRecallDescription = (
  level: string | undefined | null
): string | null => {
  if (!level || typeof level !== "string") {
    return null;
  }

  const lowerCaseLevel = level.toLowerCase();

  if (lowerCaseLevel.includes("1")) {
    return "Level 1: Reasonable chance of serious health problems or death.";
  }
  if (lowerCaseLevel.includes("2")) {
    return "Level 2: Temporary/reversible health problems.";
  }
  if (lowerCaseLevel.includes("3")) {
    return "Level 3: Not likely to cause health problems.";
  }
  if (lowerCaseLevel.includes("4")) {
    return "Level 4: Field safety notices.";
  }
  if (lowerCaseLevel.includes("5")) {
    return "Level 5: Safety alerts.";
  }

  return null; // Return nothing if no specific level is matched
};

export default function PredictionResultDisplay({
  result,
}: PredictionResultDisplayProps) {
  // Get the description from the new function
  const recallDescription = getRecallDescription(
    result.Predicted_Final_Recall_Level
  );

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ border: "1px solid #e0e0e0", borderRadius: 2, p: 2 }}
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
            label={result.Predicted_Final_Recall_Level}
            color={getChipColor(result.Predicted_Final_Recall_Level)}
            sx={{ fontSize: "1.2rem", px: 2, py: 3, mt: 1, fontWeight: "bold" }}
          />
          {/* **NEWLY ADDED DESCRIPTION DISPLAY** */}
          {recallDescription && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, fontStyle: "italic" }}
            >
              {recallDescription}
            </Typography>
          )}
        </Box>
      )}
      <List>
        {result.Reason && (
          <ListItem>
            <ListItemIcon>
              <ErrorOutlineIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Reason" secondary={result.Reason} />
          </ListItem>
        )}
        {result.Action_Type && (
          <ListItem>
            <ListItemIcon>
              <InfoOutlinedIcon color="primary" />
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
              primary="Failure Details"
              secondary={result.Failure_Details}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
