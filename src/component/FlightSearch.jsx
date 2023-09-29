import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Tabs,
  Tab,
  Typography,
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import flightData from "./flightData.json"; // Updated flight data
import departureDate from "./departureDateOptions.json";
import returnDate from "./returnDateOptions.json";
//  Files imported done
const FlightSearch = () => {
  const getValidationSchema = (tabValue) => {
    return Yup.object().shape({
      origin: Yup.string().required("Origin is required"),
      destination: Yup.string().required("Destination is required"),
      departureDate: Yup.date().required("Departure Date is required"),
      returnDate:
        tabValue === 1
          ? Yup.date().required("Return Date is required")
          : Yup.date(),
      passengers: Yup.string()
        .min(1, "Must be at least 1 passenger")
        .required("Passengers is required"),
    });
  };

  const [searchResults, setSearchResults] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [showFormData, setShowFormData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSearchResults(flightData);
    }, 1000);
  }, []);

  const formik = useFormik({
    initialValues: {
      tabValue: 0,
      origin: "",
      destination: "",
      departureDate: "",
      returnDate: "",
      passengers: "",
      priceRange: [0, 1000],
    },
    validationSchema: getValidationSchema(tabValue),
    onSubmit: (values) => {
      handleSearchSubmit(values);
    },
  });

  const handleSearchSubmit = (values) => {
    // Filter flights based on search criteria
    const results = flightData.filter((flight) => {
      return (
        flight.origin.toLowerCase() === values.origin.toLowerCase() &&
        flight.destination.toLowerCase() === values.destination.toLowerCase() &&
        flight.departureDate === values.departureDate &&
        (values.tabValue === 0 || flight.returnDate === values.returnDate) &&
        flight.passengers === values.passengers
      );
    });

    // Update search results
    setSearchResults(results);

    // Move the toggleFormData call here
    toggleFormData();

    if (results.length > 0) {
      console.log("Flight search results:", results); // Log the results to the console
    } else {
      console.log("No matching flights found."); // Log a message indicating no results
    }
  };

  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    setFieldValue,
    setFieldTouched,
    touched,
  } = formik;

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
    formik.setValues({
      ...formik.values,
      tabValue: newValue,
    });
  };

  const departureDateOptions = [...departureDate];

  const returnDateOptions = [...returnDate];

  const passengers = ["Adult", "Child", "Infant"];

  const toggleFormData = () => {
    setShowFormData(!showFormData);
  };

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      alignItems="center"
      maxWidth={{
        xs: 400,
        sm: 600,
        md: 1000,
      }}
      margin={"0 auto"}
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Flight Search
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="One Way" style={{ fontWeight: "bold" }} />
            <Tab label="Return" style={{ fontWeight: "bold" }} />
          </Tabs>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="From"
                  variant="standard"
                  fullWidth
                  placeholder="Enter origin city"
                  name="origin"
                  value={values.origin}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched("origin")}
                  error={touched.origin && Boolean(errors.origin)}
                  helperText={touched.origin && errors.origin}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="To"
                  variant="standard"
                  fullWidth
                  placeholder="Enter destination city"
                  name="destination"
                  value={values.destination}
                  onChange={handleChange}
                  onBlur={() => setFieldTouched("destination")}
                  error={touched.destination && Boolean(errors.destination)}
                  helperText={touched.destination && errors.destination}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="standard">
                  <InputLabel htmlFor="departureDate">
                    Departure Date
                  </InputLabel>
                  <Select
                    label="Departure Date"
                    name="departureDate"
                    value={values.departureDate}
                    onChange={handleChange}
                    onBlur={() => setFieldTouched("departureDate")}
                  >
                    {departureDateOptions.map((date, index) => (
                      <MenuItem key={index} value={date}>
                        {date}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.departureDate && errors.departureDate && (
                    <FormHelperText error>
                      {errors.departureDate}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              {values.tabValue === 1 && (
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="standard">
                    <InputLabel htmlFor="returnDate">Return Date</InputLabel>
                    <Select
                      name="returnDate"
                      value={values.returnDate}
                      onChange={handleChange}
                      onBlur={() => setFieldTouched("returnDate")}
                    >
                      {returnDateOptions.map((date, index) => (
                        <MenuItem key={index} value={date}>
                          {date}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.returnDate && errors.returnDate && (
                      <FormHelperText error>{errors.returnDate}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth variant="standard">
                  <InputLabel htmlFor="passengers">Passengers</InputLabel>
                  <Select
                    label="Passengers"
                    name="passengers"
                    value={values.passengers}
                    onChange={handleChange}
                    onBlur={() => setFieldTouched("passengers")}
                  >
                    {passengers.map((passenger, index) => (
                      <MenuItem key={index} value={passenger}>
                        {passenger}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.passengers && errors.passengers && (
                    <FormHelperText error>{errors.passengers}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Price Range: ${values.priceRange[0]} - ${values.priceRange[1]}
                </Typography>
                <Slider
                  value={values.priceRange}
                  onChange={(e, newValue) =>
                    setFieldValue("priceRange", newValue)
                  }
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  name="priceRange"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={Object.keys(errors).length !== 0}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        {/* Add a fixed-height div with vertical scrolling */}
        <div
          style={{
            height: "80vh", // Adjust the height as needed
            overflowY: "auto", // Enable vertical scrolling
            scrollbarWidth: "none", // Hide the scrollbar in Firefox
          }}
        >
          {searchResults.map((flight, index) => (
            <Card
              key={index}
              style={{
                border: "2px solid #007bff",
                borderRadius: "10px",
                marginTop: "20px",
              }}
            >
              <CardContent>
                <Typography variant="h6">Airline: {flight.airline}</Typography>
                <ul style={{ listStyleType: "none", padding: "0" }}>
                  <li>
                    <strong>Origin:</strong> {flight.origin}
                  </li>
                  <li>
                    <strong>Destination:</strong> {flight.destination}
                  </li>
                  <li>
                    <strong>Departure Date:</strong> {flight.departureDate}
                  </li>
                  <li>
                    <strong>Return Date:</strong> {flight.returnDate}
                  </li>
                  <li>
                    <strong>Price:</strong> ${flight.price}
                  </li>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

export default FlightSearch;
