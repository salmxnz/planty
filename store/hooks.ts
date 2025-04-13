import { RootState, useAppDispatch, useAppSelector } from './store'
import {
    setNewPlantImage,
    setPlantHealthCheckImage,
    unsetNewPlantImage,
    unsetPlantHealthCheckImage,
} from './imageSlice'

export const useImage = () => {
    const dispatch = useAppDispatch()

    const plantHealthCheckImage = useAppSelector(
        (state: RootState) => state.image.plantHealthCheckImage,
    )
    const updatePlantHealthCheckImage = (imageUri: string) =>
        dispatch(setPlantHealthCheckImage(imageUri))
    const clearPlantHealthCheckImage = () =>
        dispatch(unsetPlantHealthCheckImage())

    const newPlantImage = useAppSelector((state: RootState) => state.image.newPlantImage)
    const updateNewPlantImage = (imageUri: string) =>
        dispatch(setNewPlantImage(imageUri))
    const clearNewPlantImage = () => dispatch(unsetNewPlantImage())

    return {
        plantHealthCheckImage,
        updatePlantHealthCheckImage,
        clearPlantHealthCheckImage,
        newPlantImage,
        updateNewPlantImage,
        clearNewPlantImage,
    }
}