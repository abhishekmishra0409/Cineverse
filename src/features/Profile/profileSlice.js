import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from 'axios'

const favourite_url = 'http://localhost:3000/favourite'

const watchnext_url = 'http://localhost:3000/watchnext'

const lastviewed_url = 'http://localhost:3000/lastviewed'



const initialState = {
    isLoading: false,
    favourite: JSON.parse(localStorage.getItem("myfav")) || null,
    watchnext: JSON.parse(localStorage.getItem("mywatch")) || null,
    lastviewed: JSON.parse(localStorage.getItem("myviewed")) || null,
    message: ''
}

export const fetchFavourite = createAsyncThunk('profile/favourite', async(id, { rejectWithValue }) => {
    try {
        const favourites = await axios.get(`${favourite_url}`)
        const myFavourite = favourites.data.filter((fav) => fav.userId === id)
        localStorage.setItem("myfav", JSON.stringify(myFavourite))
        return myFavourite
    } catch (e) {
        return rejectWithValue('Failed to get favourite')
    }
})

export const addFavourite = createAsyncThunk('profile/favourite/add', async(form, { rejectWithValue }) => {
    try {
        // console.log(form);
        const res = await axios.post(`${favourite_url}`, form)
        return res.data
    } catch (e) {
        return rejectWithValue('Failed to add favourite')
    }
})

export const removeFavourite = createAsyncThunk('profile/favourite/remove', async({ id, idx }, { rejectWithValue }) => {
    try {
        // console.log(idx);
        await axios.delete(`${favourite_url}/${id}`)
        return idx
    } catch (e) {
        return rejectWithValue('Failed to delete favourite')
    }
})


export const fetchWatchnext = createAsyncThunk('profile/watchnext', async(id, { rejectWithValue }) => {
    try {
        const watclists = await axios.get(`${watchnext_url}`)
        const mywatchlist = watclists.data.filter((fav) => fav.userId === id)
        localStorage.setItem("mywatch", JSON.stringify(mywatchlist))
        return mywatchlist
    } catch (e) {
        return rejectWithValue('Failed to get watchnext')
    }
})

export const addWatchnext = createAsyncThunk('profile/watchnext/add', async(form, { rejectWithValue }) => {
    try {
        // console.log(form);
        const res = await axios.post(`${watchnext_url}`, form)
        return res.data
    } catch (e) {
        return rejectWithValue('Failed to add watchnext')
    }
})

export const removeWatchnext = createAsyncThunk('profile/watchnext/remove', async({ id, idx }, { rejectWithValue }) => {
    try {
        // console.log(idx);
        await axios.delete(`${watchnext_url}/${id}`)
        return idx
    } catch (e) {
        return rejectWithValue('Failed to delete watchnext')
    }
})


export const fetchLastViewed = createAsyncThunk('profile/lastviewed', async(id, { rejectWithValue }) => {
    try {
        const viewed = await axios.get(`${lastviewed_url}`)
        const myviewed = viewed.data.filter((fav) => fav.userId === id)
        localStorage.setItem("myviewed", JSON.stringify(myviewed))
        return myviewed
    } catch (e) {
        return rejectWithValue('Failed to get watchnext')
    }
})

export const addLastViewed = createAsyncThunk('profile/lastviewed/add', async(form, { rejectWithValue }) => {
    try {
        console.log(form);
        const viewed = await axios.get(`${lastviewed_url}`)
        const myviewed = viewed.data.filter((fav) => fav.movie.id === form.movie.id)
        console.log(myviewed);
        if (myviewed.length > 0) {
            await axios.delete(`${lastviewed_url}/${myviewed[0].id}`)
            const res = await axios.post(`${lastviewed_url}`, form)
            console.log(res.data);
            return res.data
        } else {
            const res = await axios.post(`${lastviewed_url}`, form)
            console.log(res.data);
            return res.data
        }
    } catch (e) {
        return rejectWithValue('Failed to add watchnext')
    }
})

export const removeLastviewed = createAsyncThunk('profile/lastviewed/remove', async({ id, idx }, { rejectWithValue }) => {
    try {
        // console.log(idx);
        await axios.delete(`${lastviewed_url}/${id}`)
        return idx
    } catch (e) {
        return rejectWithValue('Failed to delete watchnext')
    }
})



const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        //  FAVOURITE
            .addCase(fetchFavourite.pending, (state) => {
                state.isLoading = true
            }).addCase(fetchFavourite.fulfilled, (state, action) => {
                state.isLoading = false
                state.favourite = action.payload
                state.message = ''
            }).addCase(fetchFavourite.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(removeFavourite.pending, (state) => {
                state.isLoading = true
            }).addCase(removeFavourite.fulfilled, (state, action) => {
                state.isLoading = false
                state.favourite.splice(action.payload, 1)
                state.message = ''
            }).addCase(removeFavourite.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(addFavourite.pending, (state) => {
                state.isLoading = true
            }).addCase(addFavourite.fulfilled, (state, action) => {
                state.isLoading = false
                state.favourite.push(action.payload)
                localStorage.setItem("myfav", JSON.stringify(state.favourite))
                state.message = ''
            }).addCase(addFavourite.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
            })
            // WATCHNEXT
            .addCase(fetchWatchnext.pending, (state) => {
                state.isLoading = true
            }).addCase(fetchWatchnext.fulfilled, (state, action) => {
                state.isLoading = false
                state.watchnext = action.payload
                state.message = ''
            }).addCase(fetchWatchnext.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(removeWatchnext.pending, (state) => {
                state.isLoading = true
            }).addCase(removeWatchnext.fulfilled, (state, action) => {
                state.isLoading = false
                state.watchnext.splice(action.payload, 1)
                state.message = ''
            }).addCase(removeWatchnext.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(addWatchnext.pending, (state) => {
                state.isLoading = true
            }).addCase(addWatchnext.fulfilled, (state, action) => {
                state.isLoading = false
                state.watchnext.push(action.payload)
                localStorage.setItem("mywatch", JSON.stringify(state.watchnext))
                state.message = ''
            }).addCase(addWatchnext.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
            })
            // LASTVIEWED
            .addCase(fetchLastViewed.pending, (state) => {
                state.isLoading = true
            }).addCase(fetchLastViewed.fulfilled, (state, action) => {
                state.isLoading = false
                state.lastviewed = action.payload
                state.message = ''
            }).addCase(fetchLastViewed.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(removeLastviewed.pending, (state) => {
                state.isLoading = true
            }).addCase(removeLastviewed.fulfilled, (state, action) => {
                state.isLoading = false
                state.lastviewed.splice(action.payload, 1)
                state.message = ''
            }).addCase(removeLastviewed.rejected, (state, action) => {
                state.message = action.payload
            })
            .addCase(addLastViewed.pending, (state) => {
                state.isLoading = true
            }).addCase(addLastViewed.fulfilled, (state, action) => {
                state.isLoading = false
                state.lastviewed.push(action.payload)
                localStorage.setItem("myviewes", JSON.stringify(state.lastviewed))
                state.message = ''
            }).addCase(addLastViewed.rejected, (state, action) => {
                state.isLoading = false
                state.message = action.payload
            })
    }
})


export default profileSlice.reducer