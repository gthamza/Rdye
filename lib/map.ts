import { Driver, MarkerData } from "@/types/type";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  ) {
    console.log("Error: Missing required latitude/longitude data.");
    return;
  }

  try {
    const timesPromises = markers.map(async (marker) => {
      try {
        // Fetch directions from driver to user
        const responseToUser = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
        );
        const dataToUser = await responseToUser.json();

        if (dataToUser.status !== "OK") {
          console.log(
            "Error fetching directions to user",
            dataToUser.error_message
          );
          return;
        }

        const timeToUser = dataToUser.routes[0]?.legs[0]?.duration?.value || 0;
        const distanceToUser =
          (dataToUser.routes[0]?.legs[0]?.distance?.value || 0) / 1000;

        // Fetch directions from user to destination
        const responseToDestination = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
        );
        const dataToDestination = await responseToDestination.json();

        if (dataToDestination.status !== "OK") {
          console.log(
            "Error fetching directions to destination",
            dataToDestination.error_message
          );
          return;
        }

        const timeToDestination =
          dataToDestination.routes[0]?.legs[0]?.duration?.value || 0;
        const distanceToDestination =
          (dataToDestination.routes[0]?.legs[0]?.distance?.value || 0) / 1000;

        // Calculate total time, distance, and price
        const totalTime = (timeToUser + timeToDestination) / 60; // Total time in minutes
        const totalDistance = distanceToUser + distanceToDestination; // Total distance in km
        const price = parseFloat((totalTime * 0.5).toFixed(2)); // Price based on time

        console.log(
          `Driver ${marker.id}: Total Time = ${totalTime} mins, Total Distance = ${totalDistance} km, Price = $${price}`
        );

        return { ...marker, time: totalTime, price, distance: totalDistance };
      } catch (error) {
        console.log("Error processing marker data", marker.id, error);
      }
    });

    const results = await Promise.all(timesPromises);
    console.log("Driver data after calculation", results);
    return results;
  } catch (error) {
    console.log("Error calculating driver times:", error);
  }
};

export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005
    const lngOffset = (Math.random() - 0.5) * 0.01; // Random offset between -0.005 and 0.005

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
};

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3; // Adding some padding
  const longitudeDelta = (maxLng - minLng) * 1.3; // Adding some padding

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};
