import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { getSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { NetworkUpgrade } from "@/constants/eip-authors";
import { createPublicClient, encodePacked, getAddress, GetEnsAddressReturnType, hexToBigInt, http, isAddress, keccak256, parseAbi } from "viem";
import { foundry, mainnet } from "viem/chains";
import { normalize } from "viem/ens";
import { hasAlreadyClaimed } from "./utils";
import { CgSpinner } from "react-icons/cg";

export function NftClaimCard({ upgrade }: { upgrade: NetworkUpgrade }) {
  const upgradeName = upgrade.charAt(0).toUpperCase() + upgrade.slice(1);
  const [isEligible, setIsEligible] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [githubProfile, setGithubProfile] = useState<{ name: string, image: string }|null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const session = await getSession();
    if (session) {
      setGithubProfile({ name: session.user.name, image: session.user.image ?? "" });
      const { data: author } = await fetch(`/api/eip-author/${upgrade}/${session.user.name}`).then((res) => res.json());
      setIsEligible(!!author)
      if (!!author) {
        const alreadyClaimed = await hasAlreadyClaimed(session.user.name, upgrade)
        setIsClaimed(alreadyClaimed)
      }
    }
  }

  return (
    <div className={`flex flex-col box-black-bg w-full justify-between min-h-[${isEligible && !isClaimed ? "25" : "18"}rem] items-center p-6 border-2 border-black rounded-2xl space-y-8`}>
      <div className="flex flex-col gap-4 justify-center items-center">
        <h3 className="text-lg font-bold text-center">Is your EIP in {upgradeName}?</h3>
        <p className="text-sm text-center max-w-md mb-4">If you authored an EIP included in the upcoming {upgradeName} upgrade, you can claim our {upgradeName} edition NFT.</p>
        {githubProfile ? (
          isEligible ? (
            isClaimed ? (
              <AlreadyClaimedContent githubUsername={githubProfile.name} githubImage={githubProfile.image} />
            ) : (
              <EligibleClaimContent githubUsername={githubProfile.name} githubImage={githubProfile.image} upgrade={upgrade} />
            )
          ) : (
            <IneligibleClaimContent githubUsername={githubProfile.name} githubImage={githubProfile.image} />
          )
        ) : (
          <UnverifiedGithubContent />
        )}
      </div>
    </div>
  )
}

function UnverifiedGithubContent() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <p className="text-sm text-center">To prove you are an author, we need to verify your Github account.</p>
      <Button
        className="w-full max-w-xs"
        onClick={() => signIn("github")}
      >
        Verify your Github
      </Button>
    </div>
  )
}

function EligibleClaimContent({
  upgrade,
  githubUsername,
  githubImage
}: {
  upgrade: NetworkUpgrade,
  githubUsername: string,
  githubImage: string
}) {
  const [addressOrEns, setAddressOrEns] = useState<string>("")
  const [resolvedAddress, setResolvedAddress] = useState<`0x${string}`|null>(null)
  const [isClaiming, setIsClaiming] = useState(false)

  const ensClient = createPublicClient({
    chain: mainnet,
    transport: http()
  })

  useEffect(() => {
    if (addressOrEns) {
      resolveAddress(addressOrEns).then((address) => {
        console.log({address})
        setResolvedAddress(address)
      })
    }
  }, [addressOrEns])

  async function resolveAddress(addressOrEns: string) {
    if (addressOrEns.endsWith(".eth")) {
      return await ensClient.getEnsAddress({ name: normalize(addressOrEns) })
    } else if (isAddress(addressOrEns)) {
      return getAddress(addressOrEns)
    }
    return null
  }

  async function claimNft(upgrade: NetworkUpgrade) {
    setIsClaiming(true)
    try {
      if (!resolvedAddress) {
        throw new Error("No address resolved")
      }
      const res = await fetch(`/api/eip-author/${upgrade}/claim-nft`, {
        method: "POST",
        body: JSON.stringify({ githubUsername, upgrade, address: resolvedAddress })
      })
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      if (data.hash) {
        const client = createPublicClient({
          chain: foundry,
          transport: http('http://localhost:8545')
        })
        await client.waitForTransactionReceipt({ hash: data.hash })
      }
      console.log(data)
    } catch (error) {
      console.error(error)
    }
    setIsClaiming(false)
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex flex-row gap-2 justify-center items-center">
        <Image src={githubImage} alt="profile" width={30} height={30} className="rounded-full" />
        <p className="text-lg font-bold">{githubUsername}</p>
      </div>
      <p className="text-sm text-center">You are eligible to claim!</p>
      <Input
        placeholder="Enter your ENS or address"
        className="text-center max-w-sm"
        value={addressOrEns}
        onChange={(e) => setAddressOrEns(e.target.value)}
      />
      <Button className="w-full max-w-xs" onClick={() => claimNft(upgrade)} disabled={isClaiming}>
        {isClaiming ? <CgSpinner className="animate-spin" /> : "Claim"}
      </Button>
      <Button variant="ghost" className="w-full max-w-xs" onClick={() => signOut()}>Disconnect</Button>
    </div>
  )
}

function AlreadyClaimedContent({ githubUsername, githubImage }: { githubUsername: string, githubImage: string }) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex flex-row gap-2 justify-center items-center">
        <Image src={githubImage} alt="profile" width={30} height={30} className="rounded-full" />
        <p className="text-lg font-bold">{githubUsername}</p>
      </div>
      <p className="text-sm text-center">You have already claimed the NFT.</p>
      <Button variant="ghost" className="w-full max-w-xs" onClick={() => signOut()}>Disconnect</Button>
    </div>
  )
}

function IneligibleClaimContent({ githubUsername, githubImage }: { githubUsername: string, githubImage: string }) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center w-full">
      <div className="flex flex-row gap-2 justify-center items-center">
        <Image src={githubImage} alt="profile" width={30} height={30} className="rounded-full" />
        <p className="text-lg font-bold">{githubUsername}</p>
      </div>
      <p className="text-sm text-center">You are not eligible to claim.</p>
      <Button variant="ghost" className="w-full max-w-xs" onClick={() => signOut()}>Disconnect</Button>
    </div>
  )
}
