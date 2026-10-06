import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OpacityComponent from "../util/OpacityComponent";
import Services1 from "../util/Services1";
import API_BASE_URL from "../../../config";

export default function ServicesEN() {
    const { id } = useParams();
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/services/${id}`);
                console.log('Service EN Data Response:', response.data);
                setServiceData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching service data:", err);
                setError("Failed to load service data");
                setLoading(false);
            }
        };

        fetchServiceData();
    }, [id]);

    if (loading) return <div className="w-full text-center py-10">Loading...</div>;
    if (error) return <div className="w-full text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="w-full overflow-hidden">
            <Services1 serviceData={serviceData} />
            <OpacityComponent top="none" />
        </div>
    );
}