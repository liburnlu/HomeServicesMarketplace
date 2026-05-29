import { supabase } from "@/lib/supabase";

export async function createBooking(booking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCustomerBookings(customerId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, provider_profiles(*)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProviderBookings(providerId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, profiles(*)")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}