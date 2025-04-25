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
    return plants;
}

export { CategoriesFetch, PlantsFetch };