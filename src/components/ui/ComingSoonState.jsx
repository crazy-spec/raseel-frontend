export default function ComingSoonState(props) {
  var icon = props.icon || '🚀';
  var title = props.title || 'Coming Soon';
  var description = props.description || 'This feature is being prepared for your business.';
  var requiredStep = props.requiredStep || null;
  var onPreview = props.onPreview || null;

  return (
    <div className='flex flex-col items-center justify-center py-16 px-8 bg-white rounded-xl border border-dashed border-gray-300'>
      <div className='w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6'>
        <span className='text-4xl'>{icon}</span>
      </div>
      <h2 className='text-xl font-bold text-gray-900 mb-2'>{title}</h2>
      <p className='text-gray-500 text-center max-w-md mb-4'>{description}</p>
      {requiredStep && (
        <div className='bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-700 mb-4'>
          <span className='font-medium'>{"📋 Next step: "}</span>{requiredStep}
        </div>
      )}
      {onPreview && (
        <button
          onClick={onPreview}
          className='px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition'
        >
          {"👁️ Preview with sample data"}
        </button>
      )}
    </div>
  );
}
