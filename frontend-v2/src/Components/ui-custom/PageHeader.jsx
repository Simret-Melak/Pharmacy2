import React from 'react';

const PageHeader = ({ title, description, breadcrumbs }) => {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span>{crumb.label}</span>
              {index < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      {description && (
        <p className="text-slate-600 mt-2">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
