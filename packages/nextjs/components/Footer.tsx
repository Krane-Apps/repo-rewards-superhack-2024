import React from "react";

// import { hardhat } from "viem/chains";
// import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

/**
 * Site footer
 */
export const Footer = () => {
  // const { targetNetwork } = useTargetNetwork();
  // const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            {/* <div>
              <div className="btn btn-primary btn-sm font-normal gap-1 cursor-auto">
                <span>Dapp Developer Console</span>
              </div>
            </div> */}
            {/* {isLocalNetwork && (
              <>
                <Faucet />
                <Link href="/blockexplorer" passHref className="btn btn-primary btn-sm font-normal gap-1">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Block Explorer</span>
                </Link>
              </>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
