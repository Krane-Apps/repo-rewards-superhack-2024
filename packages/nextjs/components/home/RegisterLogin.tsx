import { useEffect, useRef, useState } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import axios from "axios";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { UserRole } from "~~/types/utils";

interface RegisterLoginProps {
  onRegisterSuccess: () => void;
  setShowRegister: (show: boolean) => void;
}

const DEBOUNCE_DELAY = 1000;

const RegisterLogin: React.FC<RegisterLoginProps> = ({ onRegisterSuccess, setShowRegister }) => {
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState("");
  const [githubId, setGithubId] = useState("");
  const [worldId, setWorldId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [githubUserDetails, setGithubUserDetails] = useState<any | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const { writeAsync: sendRegisterUserTx } = useScaffoldContractWrite({
    contractName: "RepoRewards",
    functionName: "registerUser",
    args: [username, githubId ? BigInt(githubId) : undefined, worldId, selectedRole],
  });

  const handleRegisterUser = async () => {
    if (selectedRole && username && githubId && worldId) {
      try {
        const tx = await sendRegisterUserTx();
        console.log("Registration successful:", tx);
        onRegisterSuccess();
      } catch (error) {
        console.error("Error registering user:", error);
      }
    }
  };

  const verifyProof = async (proof: any) => {
    console.log("proof", proof);
    try {
      const response = await axios.post("http://143.110.185.152:3000/webhook/worldIdVerification", proof);
      console.log("Proof verification response:", response);
      setWorldId(response.data.nullifier_hash);
      setIsVerified(true);
    } catch (error) {
      console.error("Error verifying proof:", error);
    }
  };

  const onSuccess = () => {
    console.log("Success");
  };

  const fetchGithubUserDetails = async (username: string) => {
    if (username) {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        console.log(response.data);
        setGithubId(response.data.id);
        setGithubUserDetails(response.data);
        setGithubError(null);
      } catch (error) {
        setGithubUserDetails(null);
        setGithubError("GitHub user not found");
      }
    } else {
      setGithubUserDetails(null);
      setGithubError(null);
    }
  };

  const handleGithubUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchGithubUserDetails(newUsername);
    }, DEBOUNCE_DELAY);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <>
      <div className="flex justify-end w-full m-5 p-5">
        <button onClick={() => setShowRegister(false)} className="btn-link btn-error text-red-500 rounded-md mr-5">
          Cancel
        </button>
      </div>
      <div className="flex flex-col items-center flex-grow pt-5 px-5 justify-center">
        <h2 className="text-2xl font-bold mb-8">Register/Login as {selectedRole}</h2>
        {!selectedRole && (
          <div className="flex gap-8 justify-center">
            <div
              className={`card bg-white text-neutral-content w-72 cursor-pointer shadow-lg transition-transform transform hover:scale-105 ${
                selectedRole === UserRole.PoolManager ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => setSelectedRole(UserRole.PoolManager)}
            >
              <div className="card-body items-center text-center">
                <h3 className="card-title text-black text-xl">Pool Manager</h3>
                <img src="/images/poolmanager.png" alt="Pool Manager" className="w-20 h-20 my-4" />
                <p className="text-gray-500 text-sm">Create and manage grant pools for your GitHub organisation</p>
              </div>
            </div>
            <div
              className={`card bg-white text-neutral-content w-72 cursor-pointer shadow-lg transition-transform transform hover:scale-105 ${
                selectedRole === UserRole.Contributor ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => setSelectedRole(UserRole.Contributor)}
            >
              <div className="card-body items-center text-center">
                <h3 className="card-title text-black text-xl">Contributor</h3>
                <img src="/images/contributor.png" alt="Contributor" className="w-20 h-20 my-4" />
                <p className="text-gray-500 text-sm">Register as contributor and start developing</p>
              </div>
            </div>
          </div>
        )}

        {selectedRole && (
          <div className="mt-8 flex flex-col w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">GitHub Username</label>
              <input
                type="text"
                placeholder="Enter your GitHub username"
                value={username}
                onChange={handleGithubUsernameChange}
                className="input input-bordered w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {githubUserDetails && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center">
                    <img src={githubUserDetails.avatar_url} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-semibold text-gray-700">GitHub User: {githubUserDetails.login}</p>
                      <p className="text-gray-600">{githubUserDetails.name}</p>
                    </div>
                  </div>
                </div>
              )}
              {githubError && <p className="text-red-500 mt-2">{githubError}</p>}
            </div>

            <IDKitWidget
              app_id="app_staging_bf567cc6f93645d37c11f0eb9fef7d49"
              action="login"
              verification_level={VerificationLevel.Device}
              handleVerify={verifyProof}
              onSuccess={onSuccess}
            >
              {({ open }) => (
                <button
                  onClick={open}
                  className={`btn mb-4 hover:bg-black dis ${
                    isVerified ? "bg-green-500" : "bg-black"
                  } text-white flex items-center justify-center hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  disabled={isVerified}
                  style={{ pointerEvents: isVerified ? "none" : "auto" }}
                >
                  {isVerified ? (
                    <>
                      <img src="/images/world_id_logo.png" alt="Worldcoin" className="w-8 h-8 mr-2" />
                      Verified
                    </>
                  ) : (
                    <>
                      <img src="/images/world_id_logo.png" alt="Worldcoin" className="w-8 h-8 mr-2" />
                      Verify with World ID
                    </>
                  )}
                </button>
              )}
            </IDKitWidget>

            <button
              onClick={handleRegisterUser}
              className="btn btn-primary mt-4 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterLogin;
