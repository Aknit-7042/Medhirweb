import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL + "/superadmin/companies";

// Fetch companies
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create company
export const createCompany = createAsyncThunk(
  "companies/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create company");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update company
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update company");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete company
export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete company");
      }

      return id; // Return deleted company's ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    companies: [],
    loading: false,
    err: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.err = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.err = action.payload; // Use `action.payload` for custom error messages
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (c) => c._id !== action.payload
        );
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.err = action.payload || "Something went wrong";
        }
      );
  },
});

export default companiesSlice.reducer;
