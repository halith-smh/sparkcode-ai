import React from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";
import { Github, GithubIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className="fixed top-0 left-0 w-full z-50">
            <Navbar isBordered maxWidth='fluid'>
                <NavbarBrand>
                    <NavLink to='/' className="text-white text-2xl font-extrabold"><span className="text-secondary">⚡S</span>parkCode</NavLink>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <Button startContent={<GithubIcon className='w-5 h-5'/>} showAnchorIcon as={Link} href="https://github.com/halith-smh/sparkcode-ai" target='_blank' className='bg-[#262121]' >
                        GitHub
                    </Button>
                </NavbarContent>
            </Navbar>
        </div>
    )
}

export default NavBar