
import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './features/data/dataSlice.js'
export const store = configureStore({ reducer: { data: dataReducer } })
