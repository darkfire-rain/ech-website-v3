import Heading from "@/components/ui/Heading";
import Content from "@/components/ui/content";
import PageContainer from "@/components/ui/pageContainer";
import Image from "next/image";

const resources: {
    title: string,
    link: string
}[]= [
    {
        title: 'Non-EIP Content',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxpby7LszzOnyuAyQl8WLLvh&si=8e04CIz6UZoA90ke',
    },
    {
        title: 'Beacon Chain Improvements',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxoEw29YmqJtNoFaENUUAREn&si=p55ScjtIdp7cQvUx'
    },
    {
        title: 'ERCs',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxqXee9EMQDIEz2CslTnsW0K&si=UurSHYNdf0bzt3on'
    },
    {
        title: 'NFTs',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxpUmj2UjD4BtfgC1nAAyv3p&si=wBs0rY5H7sPG8zRY'
    }
]

const Upgrades: {
    title: string,
    link: string
}[] = [
    {
        title: 'Dencun',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxpnKFDl1KzGOKqwux5JaLlv&si=ZF3ua23ubiyJXSIG'
    },
    {
        title: 'Shapella',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxpok0smGmq-dFGVHQzW84a2&si=keP7mfvXTdsOgabs'
    },
    {
        title: 'The Merge',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxqoLxXqZqT4hcYhoHoP6w12&si=XJ2mHIezVIYzBPee'
    },
    {
        title: 'Arrow Glacier',
        link: 'https://www.youtube.com/watch?v=qy81t7bZ-4Q&list=PL4cwHXAawZxqu0PKKyMzG_3BJV_xZTi1F&index=9&t=3s'
    },
    {
        title: 'Altair',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxoliK_lEjyks7ogHsjp2uEE&si=rffpfZfpOLkQ6P1H'
    },
    {
        title: 'London',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxppsQYazgJ3EWWWjY2vNxVp&si=-nr0TCFGpJl6ZCfs'
    },
    {
        title: 'Berlin',
        link: 'https://youtube.com/playlist?list=PL4cwHXAawZxrR3Z0I0eubH2fx_4Rej794&si=yF6dVP3KfORY7TS5'
    },
]



export default function PeepAnEip(){
    return(
        <PageContainer>
            <Heading text="PEEPanEIP"/>
            <Content>
            An educational video series talking about Ethereum Improvement Proposal (EIPs) and key features of upcoming upgrades.
            </Content>

            <div className="flex xl:flex-row flex-col gap-10 ">
                <div className="flex flex-col gap-4 border-b-2 border-black pb-8 border-dashed ">
                    <h3 className="xl:text-3xl text-2xl font-bold text-black">Resources</h3>
                <div className="grid grid-cols-2 gap-10 xl:max-w-2xl w-full ">
                    {
                        resources.map((res, index) => {
                            return(
                                <a href={res.link} key={index}>
                                    <div className="box-black-bg rounded-xl h-[8rem] flex gap-5 md:p-6 p-3 flex-col md:text-2xl text-xl font-bold justify-between text-darkGray border-2 border-black">
                                        {res.title}
                                    </div>
                                </a>
                            )
                        })
                    }
                </div>
                </div>

                <div className="flex flex-col gap-4">
                <h3 className="xl:text-3xl text-2xl font-bold text-black">Playlist</h3>
                <span className="flex w-full justify-center items-center">
                <iframe width="300" height="180" src="https://www.youtube.com/embed/videoseries?si=i7c_6KUkemo4CmL0&amp;list=PL4cwHXAawZxqu0PKKyMzG_3BJV_xZTi1F" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" className="rounded-lg" ></iframe>
                </span>
                <div className="w-full justify-center items-center flex">
                <Image src="/assets/paws.png" alt="peepaneip" width={150} height={50} className="w-[12rem] h-[5rem]"/>
                </div>
                </div>
            </div>

            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 pb-16admin">
            {
                        Upgrades.map((res, index) => {
                            return(
                                <a href={res.link} key={index}>
                                    <div className="box-black-bg rounded-xl h-[8rem] flex gap-5 md:p-6 p-3 flex-col md:text-2xl text-xl font-bold justify-between text-darkGray border-2 border-black">
                                        {res.title}
                                    </div>
                                </a>
                            )
                        })
                    }
            </div>
        </PageContainer>
    )
}