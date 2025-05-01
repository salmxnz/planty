import { supabase } from "@/utils/supabase";

//fetch categories function async
const CategoriesFetch = async () => {
    const {data: categories} = await supabase.from('categories').select('id, name, slug');
    // console.log(categories);
    return categories;
}

//fetch plants function async
const PlantsFetch = async () => {
    const {data: plants} = await supabase.from('plants').select('*');
    // console.log(plants);
    return {plants};
}

const PlantsFetchByCategory = async (category_id: number) => {
    const {data: plants} = await supabase.from('plants').select('*').eq('category_id', category_id);
    console.log("active category in plants fetch by category: ", category_id);
    // console.log(plants);
    return {plants};
}

const PlantDetailsFetch = async (slug: string) => {
    const {data: plant} = await supabase.from('plants').select('*').eq('slug', slug);
    // console.log(plant);
    return {plant};
}

const PlantFetchById = async (plant_id: number) => {
    const {data: plant} = await supabase.from('plants').select('*').eq('id', plant_id);
    // console.log(plant);
    return plant;
}

const FeaturesFetch = async () => {
    const {data: features} = await supabase.from('feature_types').select('*').lte('id', 4);
    // console.log(features);
    return features;
}

const FeaturesFetchById = async (feature_id: number) => {
    const {data: features} = await supabase.from('feature_types').select('*').eq('id', feature_id);
    // console.log(features);
    return features;
}

const PlantByFeaturesFetch = async (feature_id: number) => {
    const {data: plant_ids} = await supabase.from('featured_plants').select('plant_id').eq('feature_type_id', feature_id);
    console.log(plant_ids);
    
    // Create an array of promises to fetch all plants
    const plantPromises = plant_ids?.map(item => PlantFetchById(item.plant_id)) || [];
    
    // Wait for all promises to resolve
    const plantsResults = await Promise.all(plantPromises);
    
    // Flatten the array since PlantFetchById returns an array for each plant
    const allPlants = plantsResults.flat();
    
    console.log(allPlants);
    return allPlants;
}

const PlantFetchByTrait = async (trait: string, trait_value: string ) => {
    const {data: plants} = await supabase.from('plants').select('*').eq(`${trait}`, trait_value);
    console.log(plants);
    return plants;
}


export { FeaturesFetch, FeaturesFetchById, PlantFetchByTrait, CategoriesFetch, PlantsFetch, PlantsFetchByCategory, PlantDetailsFetch, PlantByFeaturesFetch };