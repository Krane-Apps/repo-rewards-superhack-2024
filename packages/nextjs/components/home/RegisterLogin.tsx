import { useState } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { UserRole } from "~~/types/utils";

interface RegisterLoginProps {
  onRegisterSuccess: () => void;
  setShowRegister: (show: boolean) => void;
}

const RegisterLogin: React.FC<RegisterLoginProps> = ({ onRegisterSuccess, setShowRegister }) => {
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState("");
  const [githubId, setGithubId] = useState("");
  const [worldId, setWorldId] = useState("");

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
  };

  const onSuccess = () => {
    console.log("Success");
  };

  return (
    <>
      <div className="flex justify-end w-full m-5 p-5 ">
        <button onClick={() => setShowRegister(false)} className="btn btn-link btn-error rounded-md mr-5">
          Cancel
        </button>
      </div>
      <div className="flex flex-col items-center flex-grow pt-5 px-5 justify-center">
        <h2 className="text-xl font-bold mb-12">Register/Login as</h2>
        <div className="flex gap-4 justify-center">
          <div
            className={`card bg-white text-neutral-content w-96 cursor-pointer ${
              selectedRole === UserRole.PoolManager ? "border border-blue-500" : ""
            }`}
            onClick={() => setSelectedRole(UserRole.PoolManager)}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title text-black">Pool Manager</h2>
              <img src="/images/poolmanager.png" alt="Pool Manager" className="w-24 h-24 my-4" />
              <p className="text-gray-500">Create and manage grant pools for your GitHub organisation</p>
            </div>
          </div>
          <div
            className={`card bg-white text-neutral-content w-96 cursor-pointer ${
              selectedRole === UserRole.Contributor ? "border border-blue-500" : ""
            }`}
            onClick={() => setSelectedRole(UserRole.Contributor)}
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title text-black">Contributor</h2>
              <img src="/images/contributor.png" alt="Contributor" className="w-24 h-24 my-4" />
              <p className="text-gray-500">Register as contributor and start developing</p>
            </div>
          </div>
        </div>
        {selectedRole && (
          <div className="mt-4 flex flex-col w-full max-w-xs">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="input input-bordered w-full max-w-xs mb-4"
            />
            <input
              type="text"
              placeholder="GitHub ID"
              value={githubId}
              onChange={e => setGithubId(e.target.value)}
              className="input input-bordered w-full max-w-xs mb-4"
            />
            <IDKitWidget
              app_id="app_staging_bf567cc6f93645d37c11f0eb9fef7d49"
              action="login"
              verification_level={VerificationLevel.Device}
              handleVerify={verifyProof}
              onSuccess={onSuccess}
            >
              {({ open }) => <button onClick={open}>Verify with World ID</button>}
            </IDKitWidget>
            <input
              type="text"
              placeholder="World ID"
              value={worldId}
              onChange={e => setWorldId(e.target.value)}
              className="input input-bordered w-full max-w-xs mb-4"
            />
            <button onClick={handleRegisterUser} className="btn btn-primary">
              Register as {selectedRole}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterLogin;
