import { supabase } from "@/utils/supabase";

//fetch categories function async
const CategoriesFetch = async () => {
    const {data: categories} = await supabase.from('categories').select('id, name, slug');
    console.log(categories);
    return categories;
}

//fetch plants function async
const PlantsFetch = async () => {
    const {data: plants} = await supabase.from('plants').select('*');
    console.log(plants);
    return {plants};
}

const PlantsFetchByCategory = async (category_id: number) => {
    const {data: plants} = await supabase.from('plants').select('*').eq('category_id', category_id);
    console.log("active category in plants fetch by category: ", category_id);
    console.log(plants);
    return {plants};
}

const PlantDetailsFetch = async (slug: string) => {
    const {data: plant} = await supabase.from('plants').select('*').eq('slug', slug);
    console.log(plant);
    return {plant};
}

export { CategoriesFetch, PlantsFetch, PlantsFetchByCategory, PlantDetailsFetch };