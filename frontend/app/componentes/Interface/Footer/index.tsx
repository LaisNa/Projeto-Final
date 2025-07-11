const Footer = () => {
    const sysName: string = process.env.NEXT_PUBLIC_SYS_NAME || '[SysName]';
    return (
        <footer className="bg-gray-200 dark:bg-gray-800 py-5 pl-2 pr-2">
            <div className="container-portal">
                Copyright © <span x-text="new Date().getFullYear()">2025</span> {sysName}
            </div>
        </footer>
    )
}

export default Footer;