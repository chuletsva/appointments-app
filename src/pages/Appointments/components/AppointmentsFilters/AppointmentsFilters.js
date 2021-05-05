/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  InputLabel,
  Select,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  makeStyles,
  MenuItem,
  Grid,
} from "@material-ui/core";
import { Search as SearchIcon, Clear as ClearIcon } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";

import { matchSorter } from "match-sorter";

import { getFullName } from "utils/userUtils";

import { loadAppointments } from "../AppointmentsTable/appointmentsTableSlice";

import {
  loadUsers,
  loadClients,
  loadAppointmentStatuses,
  selectFilter,
  setFilterValue,
  clearFilter,
  selectUsers,
  selectClients,
  selectAppointmentStatuses,
} from "./AppointmentsFiltersSlice";

const useStyle = makeStyles((theme) => ({
  form: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  control: {
    width: 200,
  },
}));

export default function AppointmentsFilters() {
  const dispatch = useDispatch();
  const classes = useStyle();
  const filter = useSelector(selectFilter);
  const users = useSelector(selectUsers);
  const clients = useSelector(selectClients);
  const appointmentStatuses = useSelector(selectAppointmentStatuses);

  useEffect(() => {
    dispatch(loadUsers());
    dispatch(loadClients());
    dispatch(loadAppointmentStatuses());
  }, []);

  function handleFilterFieldChange(e) {
    const { name } = e.target;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    dispatch(setFilterValue({ name, value }));
  }

  function handleHolderChange(_, holder) {
    dispatch(
      setFilterValue({
        name: "holderId",
        value: holder?.id ?? "",
      }),
    );
  }

  function handleClientChange(_, client) {
    dispatch(setFilterValue({ name: "clientId", value: client?.id ?? "" }));
  }

  function handleOnClear() {
    dispatch(clearFilter());
    dispatch(loadAppointments());
  }

  function handleFilterRequest() {
    dispatch(loadAppointments());
  }

  function filterOptions(options, { inputValue }) {
    return matchSorter(options, inputValue, {
      keys: [(item) => getFullName(item)],
    }).sort((firstUser, secondUser) => {
      const first =
        firstUser.lastName && firstUser.lastName.charAt(0).toUpperCase();
      const second =
        secondUser.lastName && secondUser.lastName.charAt(0).toUpperCase();

      if (first > second) return 1;
      if (first < second) return -1;
      return 0;
    });
  }

  const rowSpacing = 5;

  return (
    <form className={classes.form} noValidate>
      <Grid container>
        <Grid item container xs direction="column" spacing={rowSpacing}>
          <Grid item container justify="center">
            <TextField
              className={classes.control}
              name="startDate"
              label="С"
              type="date"
              value={filter.startDate}
              onChange={handleFilterFieldChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item container justify="center">
            <FormControl className={classes.control}>
              <InputLabel id="statusId-label">Статус</InputLabel>

              <Select
                id="statusId-select"
                name="statusId"
                labelId="statusId-label"
                value={filter.statusId}
                onChange={handleFilterFieldChange}
              >
                <MenuItem key={-1} value="">
                  Нет
                </MenuItem>

                {appointmentStatuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item container justify="center">
            <FormControlLabel
              className={classes.control}
              control={
                <Checkbox
                  name="onlyMe"
                  checked={filter.onlyMe}
                  onChange={handleFilterFieldChange}
                  color="primary"
                />
              }
              label="Только я"
            />
          </Grid>
        </Grid>

        <Grid item container xs direction="column" spacing={rowSpacing}>
          <Grid item container justify="center">
            <TextField
              className={classes.control}
              name="finishDate"
              label="По"
              type="date"
              value={filter.finishDate}
              onChange={handleFilterFieldChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item container justify="center">
            <Autocomplete
              className={classes.control}
              id="holderId"
              onChange={handleHolderChange}
              value={users.find((x) => x.id === filter.holderId) ?? ""}
              filterOptions={filterOptions}
              options={users}
              getOptionLabel={(option) => getFullName(option)}
              groupBy={(option) =>
                option.lastName && option.lastName.charAt(0).toUpperCase()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="holderId"
                  label="Принимающий"
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid item container xs direction="column" spacing={rowSpacing}>
          <Grid item container justify="center">
            <TextField
              className={classes.control}
              name="complaints"
              label="Жалобы"
              value={filter.complaints}
              onChange={handleFilterFieldChange}
            />
          </Grid>

          <Grid item container justify="center">
            <Autocomplete
              className={classes.control}
              id="clientId"
              onChange={handleClientChange}
              value={clients.find((x) => x.id === filter.clientId) ?? ""}
              filterOptions={filterOptions}
              options={clients}
              getOptionLabel={(option) => getFullName(option)}
              groupBy={(option) =>
                option.lastName && option.lastName.charAt(0).toUpperCase()
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="clientId"
                  label="Клиент"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item container justify="center">
            <IconButton color="default" onClick={handleFilterRequest}>
              <SearchIcon />
            </IconButton>

            <IconButton color="default" onClick={handleOnClear}>
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
