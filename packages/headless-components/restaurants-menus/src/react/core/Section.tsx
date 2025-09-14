import React, { createContext, useContext } from "react";
import type { Section } from "../../../../components/restaurants-menus/types";

export interface SectionProps {
  children: React.ReactNode;
  section: Section;
}

interface SectionContextValue {
  section: Section;
}

const SectionContext = createContext<SectionContextValue | null>(null);

export function Section(props: SectionProps) {
  const contextValue: SectionContextValue = {
    section: props.section,
  };

  return (
    <SectionContext.Provider value={contextValue}>
      {props.children}
    </SectionContext.Provider>
  );
}

export function useSectionContext() {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSectionContext must be used within Section");
  }
  return context;
}

export interface SectionNameProps {
  children: (props: { name: string }) => React.ReactNode;
}

export interface SectionDescriptionProps {
  children: (props: { description: string }) => React.ReactNode;
}

export function Name(props: SectionNameProps) {
  const { section } = useSectionContext();

  return props.children({ name: section.name ?? "" });
}

export function Description(props: SectionDescriptionProps) {
  const { section } = useSectionContext();

  return props.children({ description: section.description ?? "" });
}
