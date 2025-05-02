import { supabase } from "@/utils/supabase";

//fetch categories function async
const CategoriesFetch = async () => {
    const {data: categories} = await supabase.from('categories').select('*');
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
    
    if (!plant_ids || plant_ids.length === 0) {
        return [];
    }
    
    // Extract plant IDs from the result
    const ids = plant_ids.map(item => item.plant_id);
    
    // Fetch plants with these IDs
    const {data: plants} = await supabase.from('plants').select('*').in('id', ids);
    return plants;
}

const PlantFetchByTrait = async (trait: string, trait_value: string ) => {
    const {data: plants} = await supabase.from('plants').select('*').eq(`${trait}`, trait_value);
    console.log(plants);
    return plants;
}

// Function to fetch all plants for search functionality
const AllPlantsFetch = async () => {
    const { data: plants, error } = await supabase.from('plants').select('*');
    
    if (error) {
        console.error('Error fetching all plants:', error);
        return [];
    }
    
    return plants || [];
}

// Function to fetch a category name by its ID
const CategoryNameFetchById = async (category_id: number) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('name')
            .eq('id', category_id)
            .single();
        
        if (error) {
            console.error('Error fetching category name:', error);
            return null;
        }
        
        return data?.name || 'Unknown Category';
    } catch (error) {
        console.error('Exception fetching category name:', error);
        return 'Unknown Category';
    }
}

export { 
    FeaturesFetch, 
    FeaturesFetchById, 
    PlantFetchByTrait, 
    CategoriesFetch, 
    PlantsFetch, 
    PlantsFetchByCategory, 
    PlantDetailsFetch, 
    PlantByFeaturesFetch,
    AllPlantsFetch,
    CategoryNameFetchById
};