import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import TemplateOne from './TemplateOne';
import TemplateTwo from './TemplateTwo';
import TemplateThree from './TemplateThree';

const RenderResume = forwardRef(({
  templateId,
  resumeData,
  containerWidth,
}, ref) => {
  const template01Ref = useRef(null);
  const template02Ref = useRef(null);
  const template03Ref = useRef(null);

  // Expose the appropriate template ref to parent component
  useImperativeHandle(ref, () => ({
    getCurrentTemplateRef: () => {
      switch (templateId) {
        case '01':
          return template01Ref.current;
        case '02':
          return template02Ref.current;
        case '03':
          return template03Ref.current;
        default:
          return null;
      }
    },
    getTemplateElement: () => {
      const element = ref?.getCurrentTemplateRef?.() || 
                     template01Ref.current || 
                     template02Ref.current || 
                     template03Ref.current;
      return element;
    }
  }), [templateId]);

  switch (templateId) {
    case '01':
      return (
        <div ref={template01Ref}>
          <TemplateOne
            resumeData={resumeData}
            containerWidth={containerWidth}
          />
        </div>
      );

    case '02':
      return (
        <div ref={template02Ref}>
          <TemplateTwo
            resumeData={resumeData}
            containerWidth={containerWidth}
          />
        </div>
      );

    case '03':
      return (
        <div ref={template03Ref}>
          <TemplateThree
            resumeData={resumeData}
            containerWidth={containerWidth}
          />
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-2">❌</div>
            <h3 className="text-red-700 font-semibold mb-1">Template Not Found</h3>
            <p className="text-red-600 text-sm">
              No template found for ID: "<span className="font-mono">{templateId}</span>"
            </p>
            <p className="text-red-500 text-xs mt-2">
              Available templates: 01, 02, 03
            </p>
          </div>
        </div>
      );
  }
});

RenderResume.displayName = 'RenderResume';

export default RenderResume;