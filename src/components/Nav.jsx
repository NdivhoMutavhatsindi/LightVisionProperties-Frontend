import { Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, SparklesIcon, BuildingOffice2Icon, MapPinIcon, PhoneIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils.js";

const menuItems = [
  { to: "/", label: "Home", icon: SparklesIcon },
  { to: "/properties", label: "Properties", icon: BuildingOffice2Icon },
  { to: "/valuation", label: "Valuation", icon: CurrencyDollarIcon },
  { to: "/bond-calculator", label: "Bond Calc", icon: MapPinIcon },
  { to: "/contact", label: "Contact", icon: PhoneIcon },
];

export default function Nav() {
  return (
    <Disclosure as="nav" className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {({ open }) => (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-orange-400 text-slate-950">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <div>
                <NavLink to="/" className="text-lg font-semibold tracking-tight text-slate-900">
                  Light Vision
                </NavLink>
                <p className="text-xs text-slate-500">Premium property crafted for modern buyers.</p>
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-4">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                      isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <NavLink to="/properties" className="hidden lg:inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition">
                Browse listings
              </NavLink>
              <Disclosure.Button className="inline-flex items-center justify-center rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-white md:hidden">
                <span className="sr-only">Open menu</span>
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>
            </div>
          </div>

          <Transition
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-2 py-3">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  );
}
