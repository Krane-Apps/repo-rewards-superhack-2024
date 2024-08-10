import { useState } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { UserRole } from "~~/types/utils";
import { auth, githubProvider } from "~~/utils/firebaseConfig";

interface RegisterLoginProps {
  onRegisterSuccess: () => void;
  setShowRegister: (show: boolean) => void;
}

const RegisterLogin: React.FC<RegisterLoginProps> = ({ onRegisterSuccess, setShowRegister }) => {
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [githubId, setGithubId] = useState<string>("");
  const [username, setUsername] = useState<string | null>("");
  const [worldId, setWorldId] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isGithubVerified, setIsGithubVerified] = useState<boolean>(false);

  const { writeAsync: sendRegisterUserTx } = useScaffoldContractWrite({
    contractName: "RepoRewards",
    functionName: "registerUser",
    args: [username ? username : "", githubId ? BigInt(githubId) : undefined, worldId, selectedRole],
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
    console.log("Proof received:", proof);
    try {
      const response = await axios.post("https://143-110-185-152.nip.io/webhook/worldIdVerification", proof);
      console.log("Proof verification response:", response);
      setWorldId(response.data.nullifier_hash);
      setIsVerified(true);
    } catch (error) {
      console.error("Error verifying proof:", error);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const githubId = user.providerData[0].uid;

      // Request to GitHub API to get the username using the GitHub ID
      const githubUserResponse = await axios.get(`https://api.github.com/user/${githubId}`);
      const username = githubUserResponse.data.login;

      setGithubId(githubId);
      setUsername(username);
      setIsGithubVerified(true);

      console.log("GitHub User Details:", user);
    } catch (error) {
      console.error("GitHub login failed", error);
    }
  };

  const isSubmitDisabled = !(isGithubVerified && isVerified);

  return (
    <>
      <div className="flex justify-end w-full p-4">
        <button onClick={() => setShowRegister(false)} className="text-red-500 hover:underline">
          Cancel
        </button>
      </div>
      <div className="flex flex-col items-center justify-center p-4 space-y-8">
        <h2 className="text-2xl font-bold">Register/Login as {selectedRole}</h2>

        {!selectedRole && (
          <div className="flex gap-8">
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
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 text-sm font-bold">Step 1</label>
              <button
                onClick={handleGitHubLogin}
                className="btn btn-primary w-60 bg-white text-black border border-gray-300 flex items-center justify-center space-x-2"
              >
                <img src="/images/github_login.png" alt="GitHub" className="w-6 h-6" />
                <span>{isGithubVerified ? username : "Login with GitHub"}</span>
              </button>
              <img
                src={isGithubVerified ? "/images/green_check_icon.png" : "/images/grey_check_icon.png"}
                alt="GitHub Verified"
                className="w-6 h-6 ml-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-700 text-sm font-bold">Step 2</label>
              <IDKitWidget
                app_id="app_staging_bf567cc6f93645d37c11f0eb9fef7d49"
                action="login"
                verification_level={VerificationLevel.Device}
                handleVerify={verifyProof}
                onSuccess={() => console.log("Verification Successful")}
              >
                {({ open }) => (
                  <button
                    onClick={open}
                    className={`btn w-60 flex items-center justify-center space-x-2 ${
                      isVerified ? "bg-green-500" : "bg-black"
                    } text-white`}
                    disabled={isVerified}
                  >
                    <img src="/images/worldcoin_white.png" alt="Worldcoin" className="w-6 h-6" />
                    <span>{isVerified ? "Verified with World ID" : "Verify with World ID"}</span>
                  </button>
                )}
              </IDKitWidget>
              <img
                src={isVerified ? "/images/green_check_icon.png" : "/images/grey_check_icon.png"}
                alt="World ID Verified"
                className="w-6 h-6 ml-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-700 text-sm font-bold">Step 3</label>
              <button
                onClick={handleRegisterUser}
                className="btn btn-primary w-60 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitDisabled}
              >
                Submit
              </button>
              <img
                src={isSubmitDisabled ? "/images/grey_check_icon.png" : "/images/green_check_icon.png"}
                alt="Submit Ready"
                className="w-6 h-6 ml-2"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterLogin;
