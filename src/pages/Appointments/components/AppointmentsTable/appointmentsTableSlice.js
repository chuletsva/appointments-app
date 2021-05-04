/* eslint-disable no-param-reassign */
import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import appointmentService from "services/appointmentService";

const appointmentsAdapter = createEntityAdapter();

const initialState = {
  data: appointmentsAdapter.getInitialState({
    isLoading: false,
    error: false,
    shouldReload: false,
  }),

  pagination: {
    currentPage: 0,
    itemsPerPage: 5,
    availableItemsPerPage: [5, 15, 25],
    pageSize: 0,
    totalItems: 0,
  },

  sorting: {
    field: "",
    order: "asc",
  },
};

export const loadAppointments = createAsyncThunk(
  "appointments/table/loadAppointments",
  (_, { getState }) => {
    const state = getState();
    const { sorting, pagination } = state.appointments.table;
    const { filter } = state.appointments.filters;

    return appointmentService.getAll({ ...filter, ...sorting, ...pagination });
  },
);

const tableSlice = createSlice({
  name: "appointments/table",

  initialState,

  reducers: {
    setSorting(state, action) {
      state.sorting = action.payload;
    },

    setCurrentPage(state, action) {
      state.pagination.currentPage = action.payload;
    },

    setItemsPerPage(state, action) {
      let itemsPerPage = action.payload;

      if (!state.pagination.availableItemsPerPage.includes(itemsPerPage)) {
        [itemsPerPage] = state.pagination.availableItemsPerPage;
      }

      state.pagination.itemsPerPage = itemsPerPage;
    },

    clearError(state) {
      state.data.error = false;
    },

    setShouldReload(state, action) {
      state.data.shouldReload = action.payload;
    },
  },

  extraReducers: {
    [loadAppointments.pending](state) {
      state.data.isLoading = true;
    },

    [loadAppointments.fulfilled](state, action) {
      const { data, pageSize, totalItems } = action.payload;
      state.data.isLoading = false;
      state.data.error = false;
      state.data = appointmentsAdapter.setAll(state.data, data);
      state.pagination.pageSize = pageSize;
      state.pagination.totalItems = totalItems;
    },

    [loadAppointments.rejected](state) {
      state.data.isLoading = false;
      state.data.error = true;
    },
  },
});

export const tableReducer = tableSlice.reducer;

export const {
  setSorting,
  setCurrentPage,
  setItemsPerPage,
  clearError,
  setShouldReload,
} = tableSlice.actions;

export const {
  selectIds: selectAppointmentIds,
  selectAll: selectAllAppointments,
  selectById: selectAppointmentById,
} = appointmentsAdapter.getSelectors((state) => state.appointments.table.data);

export const selectSorting = (state) => state.appointments.table.sorting;

export const selectPagination = (state) => state.appointments.table.pagination;

export const selectAppointmentsIsLoading = (state) =>
  state.appointments.table.data.isLoading;

export const selectAppointmentsError = (state) =>
  state.appointments.table.data.error;

export const selectShouldReload = (state) =>
  state.appointments.table.data.shouldReload;

export default tableSlice;