export type SVG =
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | React.ForwardRefExoticComponent<
          Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
              title?: string | undefined;
              titleId?: string | undefined;
          } & React.RefAttributes<SVGSVGElement>
      >;

export type OmitStrict<T extends object, K extends keyof T> = Pick<
    T,
    Exclude<keyof T, K>
>;
