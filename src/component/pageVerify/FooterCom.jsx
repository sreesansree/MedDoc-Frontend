import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsGithub, BsLinkedin } from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8  border-teal-400">
      <div className="w-full mx-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link to="/">
              <span
                className="px-2 py-1 bg-gradient-to-r from-indigo-400
        via-purple-300 to-pink-400 rounded-lg text-white"
              >
                Med
              </span>
              Doc
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/sreesansree?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                ></Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MedDoc
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/sreesansree"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/sreesankar-p/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className=" w-full sm:flex sm:items-center sm:justify-between ">
          <Footer.Copyright
            href="#"
            by="sreesankar "
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon
              href="https://github.com/sreesansree"
              icon={BsGithub}
            />
            <Footer.Icon
              href="https://www.linkedin.com/in/sreesankar-p/"
              icon={BsLinkedin}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
