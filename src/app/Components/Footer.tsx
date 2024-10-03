import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import Link from "next/link";

const Footer = () => {
    const items = [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Privacy Policy',
            href: '/privacy-policy'
        },
        {
            text: 'Terms of Service',
            href: '/terms-of-service'
        },
        {
            text: 'Questions',
            href: '/ques'
        },
    ]
    return (
        <footer className="relative block overflow-hidden border-t border-solid border-white/30 py-20">
            <div className="container mx-auto px-4">
                <ul className="flex flex-wrap items-center justify-center gap-3">
                    {items.map(i => (
                        <li key={i.href}>
                            <Link href={i.href}>
                                {i.text}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 text-center">
                    &copy; {new Date().getFullYear()} Supradeep
                </div>
            </div>
            <AnimatedGridPattern duration={3} maxOpacity={.4} numSquares={30} repeatDelay={1} className='[mask-image:radial-gradient(3000px_circle_at_center,white,transparent)] inset-y-[-50%] h-[200%] skew-y-6' />
        </footer>
    )
}

export default Footer