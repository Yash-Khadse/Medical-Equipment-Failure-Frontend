// Common types for the Medical Device Prediction App

// Form input data type
export interface FormData {
  device_name: string;
  manufacturer_name: string;
  implanted: string;
  action_type: string;
}

// API Prediction result type
export interface PredictionResult {
  error?: string;
  details?: string;
  Predicted_Final_Recall_Level?: string;
  Reason?: string;
  Action_Type?: string;
  Failure_Details?: string;
}
