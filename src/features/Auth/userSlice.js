import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios'

const base_url = 'http://localhost:3000/users'

const initialState = {
    isLoading: false,
    users: [],
    user: JSON.parse(localStorage.getItem("user")) || null,
    message: ''
}

export const loginUser = createAsyncThunk('user/loginUser', async(form, { rejectWithValue }) => {
    try {
        const users = await axios.get(`${base_url}`)
        const findUser = users.data.find((user) => user.username === form.username && user.password === form.password)
        if (findUser) {
            localStorage.setItem("user", JSON.stringify(findUser))
            return findUser;
        } else {
            return rejectWithValue('Invalid Username or Password')
        }
    } catch (error) {
        return rejectWithValue('Login Failed')
    }

})

export const registerUser = createAsyncThunk('user/registerUser', async(form, { rejectWithValue }) => {
    try {
        if (form.password !== form.confirmPassword) {
            return rejectWithValue('Password Does not match')
        }
        const users = await axios.get(`${base_url}`)
        const findUser = users.data.find((user) => user.username === form.username)
        if (findUser) {
            return rejectWithValue('User Already Registered')
        } else {
            const { confirmPassword, ...singlePass } = form
            await axios.post(base_url, singlePass)
            localStorage.setItem("user", JSON.stringify(singlePass))
            return singlePass
        }
    } catch (er) {
        return rejectWithValue('Register Failed')
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null
            localStorage.removeItem('user')
        }
    },
    extraReducers: (builder) => {
        builder
        //Login 
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
            }).addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.message = ''
            }).addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
            })
            //Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
            }).addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.message = ''
            }).addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
            })
    }
})

export const { setUser, logout } = userSlice.actions

export default userSlice.reducer