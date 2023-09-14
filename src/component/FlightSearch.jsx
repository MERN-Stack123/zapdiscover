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
import flightData from "./flightData.json";
import departureDate from "./departureDateOptions.json";
import returnDate from "./returnDateOptions.json";

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
    const isValidOrigin = flightData.some(
      (flight) => flight.origin === values.origin
    );
    const isValidDestination = flightData.some(
      (flight) => flight.destination === values.destination
    );

    if (!isValidOrigin || !isValidDestination) {
      alert("Please enter valid origin and destination.");
      return;
    }
    const results = flightData.filter((flight) => {
      return (
        flight.origin === values.origin &&
        flight.destination === values.destination &&
        flight.departureDate === values.departureDate &&
        flight.returnDate === values.returnDate
      );
    });

    setSearchResults(results);

    if (results.length > 0) {
      const selected = results.reduce((prev, current) =>
        prev.price < current.price ? prev : current
      );
      console.log("Flight search results:", results); // Log the results to the console
    } else {
      console.log("No matching flights found."); // Log a message indicating no results
    }

    // Move the toggleFormData call here
    toggleFormData();
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
                  placeholder="enter origin city"
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
                  placeholder="enter destination city"
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
                  max={1000}
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
      {/* code */}
      <Grid item xs={12} md={6}>
        {showFormData && (
          <Card style={{ border: "2px solid #007bff", borderRadius: "10px" }}>
            <CardContent>
              <Typography variant="h6">Your Ticket</Typography>
              <ul style={{ listStyleType: "none", padding: "0" }}>
                <li>
                  <strong>Origin:</strong> {values.origin}
                </li>
                <li>
                  <strong>Destination:</strong> {values.destination}
                </li>
                <li>
                  <strong>Departure Date:</strong> {values.departureDate}
                </li>
                <li>
                  <strong>Return Date:</strong> {values.returnDate}
                </li>
                <li>
                  <strong>Passengers:</strong> {values.passengers}
                </li>
                <li>
                  <strong>Price:</strong> ${values.priceRange[1]}
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default FlightSearch;
