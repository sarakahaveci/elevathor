// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Customers
export const fetchData = createAsyncThunk('appCustomers/fetchData', async (params: DataParams) => {
  //("fetching data /apps/customers/list");
  const response = await axios.get('/apps/customers/list', {
    params
  })

  //("fetched data /apps/customers/list");

  return response.data
})

// ** Add Customer
export const addCustomer = createAsyncThunk(
  'appCustomers/addCustomer',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post('/apps/customers/add-customer', {
      data
    })
    dispatch(fetchData(getState().customer.params))

    return response.data
  }
)

// ** Delete Customer
export const deleteCustomer = createAsyncThunk(
  'appCustomers/deleteCustomer',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/apps/customers/delete', {
      data: id
    })
    dispatch(fetchData(getState().customer.params))

    return response.data
  }
)

export const appCustomersSlice = createSlice({
  name: 'appCustomers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.customers
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appCustomersSlice.reducer
