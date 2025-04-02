import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ImageState {
    plantHealthCheckImage: string | undefined
    newPlantImage: string | undefined
}

const initialState: ImageState = {
    plantHealthCheckImage: undefined,
    newPlantImage: undefined,
}

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        setPlantHealthCheckImage: (state: ImageState, action: PayloadAction<string>) => {
            state.plantHealthCheckImage = action.payload
        },
        unsetPlantHealthCheckImage: (state: ImageState) => {
            state.plantHealthCheckImage = undefined
        },
        setNewPlantImage: (state: ImageState, action: PayloadAction<string>) => {
            state.newPlantImage = action.payload
        },
        unsetNewPlantImage: (state: ImageState) => {
            state.newPlantImage = undefined
        },
    },
})

export const {
    setPlantHealthCheckImage,
    unsetPlantHealthCheckImage,
    setNewPlantImage,
    unsetNewPlantImage,
} = imageSlice.actions

export default imageSlice.reducer
