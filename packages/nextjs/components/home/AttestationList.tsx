import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";

interface Attestation {
  id: string;
  decodedDataJson: string;
}

const AttestationList: React.FC<{ userType: string }> = ({ userType }) => {
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { address: connectedAddress } = useAccount();

  useEffect(() => {
    const fetchAttestations = async () => {
      setLoading(true);
      try {
        let res;
        if (userType === "Contributor" && connectedAddress) {
          res = await axios.get(`http://143.110.185.152:3000/webhook/attestationRecipient/${connectedAddress}`);
        } else {
          res = await axios.get(
            "http://143.110.185.152:3000/webhook/attestationAttester/0xfe79ef5c242656220aD2b606AF755E505738F3C4",
          );
        }
        setAttestations(res.data);
      } catch (error) {
        console.error("Error fetching attestations:", error);
        setAttestations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttestations();
  }, [userType, connectedAddress]);

  const handleCardClick = (id: string) => {
    window.open(`https://optimism-sepolia.easscan.org/attestation/view/${id}`, "_blank");
  };

  if (loading) {
    return <p>Loading attestations...</p>;
  }

  if (!attestations.length) {
    return <p>No attestations found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {attestations.map(attestation => {
        const decodedData = JSON.parse(attestation.decodedDataJson);
        const username = decodedData.find((data: any) => data.name.toLowerCase().includes("username"))?.value.value;
        const description = decodedData.find((data: any) => data.name.toLowerCase().includes("achievement"))?.value
          .value;

        if (!description) return null; // Skip card if description is empty

        return (
          <div
            key={attestation.id}
            className="card bg-base-100 shadow-xl cursor-pointer transition-shadow"
            onClick={() => handleCardClick(attestation.id)}
          >
            <div className="card-body">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{username}</h3>
                <span className="badge badge-success">Success</span>
              </div>
              <p className="text-gray-700">{description}</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary" onClick={() => handleCardClick(attestation.id)}>
                  <img src="/images/eas_logo.png" alt="eas" className="w-8 h-8" />
                  View on EAS
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttestationList;
