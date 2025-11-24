import Swal from 'sweetalert2';

const getCommonConfig = () => ({
  background: '#0a0c10',
  color: '#fff',
  customClass: {
    popup: '!bg-[#0a0c10] !border !border-white/10 !rounded-2xl',
    title: '!text-white !font-bold',
    htmlContainer: '!text-gray-300',
    confirmButton: '!bg-blue-500 hover:!bg-blue-600 !rounded-lg !px-6 !py-2 !font-semibold',
    cancelButton: '!bg-gray-600 hover:!bg-gray-700 !rounded-lg !px-6 !py-2 !font-semibold',
  },
  buttonsStyling: false,
  allowOutsideClick: false,
  allowEscapeKey: true,
});

export class AlertService {
  static success(title, message, onPress) {
    const hasNewlines = message && message.includes('\n');
    Swal.fire({
      ...getCommonConfig(),
      icon: 'success',
      title: title,
      [hasNewlines ? 'html' : 'text']: hasNewlines ? message.replace(/\n/g, '<br>') : (message || ''),
      confirmButtonText: 'OK',
      customClass: {
        ...getCommonConfig().customClass,
        confirmButton: '!bg-green-500 hover:!bg-green-600 !rounded-lg !px-6 !py-2 !font-semibold',
      },
    }).then(() => {
      onPress?.();
    });
  }

  static error(title, message, onPress) {
    const hasNewlines = message && message.includes('\n');
    Swal.fire({
      ...getCommonConfig(),
      icon: 'error',
      title: title,
      [hasNewlines ? 'html' : 'text']: hasNewlines ? message.replace(/\n/g, '<br>') : (message || ''),
      confirmButtonText: 'OK',
      customClass: {
        ...getCommonConfig().customClass,
        confirmButton: '!bg-red-500 hover:!bg-red-600 !rounded-lg !px-6 !py-2 !font-semibold',
      },
    }).then(() => {
      onPress?.();
    });
  }

  static warning(title, message, onPress) {
    const hasNewlines = message && message.includes('\n');
    Swal.fire({
      ...getCommonConfig(),
      icon: 'warning',
      title: title,
      [hasNewlines ? 'html' : 'text']: hasNewlines ? message.replace(/\n/g, '<br>') : (message || ''),
      confirmButtonText: 'OK',
      customClass: {
        ...getCommonConfig().customClass,
        confirmButton: '!bg-yellow-500 hover:!bg-yellow-600 !rounded-lg !px-6 !py-2 !font-semibold',
      },
    }).then(() => {
      onPress?.();
    });
  }

  static confirm(title, message, onConfirm, onCancel) {
    const hasNewlines = message && message.includes('\n');
    Swal.fire({
      ...getCommonConfig(),
      icon: 'question',
      title: title,
      [hasNewlines ? 'html' : 'text']: hasNewlines ? message.replace(/\n/g, '<br>') : (message || ''),
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      customClass: {
        ...getCommonConfig().customClass,
        confirmButton: '!bg-red-500 hover:!bg-red-600 !rounded-lg !px-6 !py-2 !font-semibold',
        cancelButton: '!bg-gray-600 hover:!bg-gray-700 !rounded-lg !px-6 !py-2 !font-semibold',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm?.();
      } else {
        onCancel?.();
      }
    });
  }

  static info(title, message, onPress) {
    const hasNewlines = message && message.includes('\n');
    Swal.fire({
      ...getCommonConfig(),
      icon: 'info',
      title: title,
      [hasNewlines ? 'html' : 'text']: hasNewlines ? message.replace(/\n/g, '<br>') : (message || ''),
      confirmButtonText: 'OK',
      customClass: {
        ...getCommonConfig().customClass,
        confirmButton: '!bg-blue-500 hover:!bg-blue-600 !rounded-lg !px-6 !py-2 !font-semibold',
      },
    }).then(() => {
      onPress?.();
    });
  }

  static alert(title, message, onPress) {
    const hasNewlines = message && message.includes('\n');
    Swal.fire({
      ...getCommonConfig(),
      title: title,
      [hasNewlines ? 'html' : 'text']: hasNewlines ? message.replace(/\n/g, '<br>') : (message || ''),
      confirmButtonText: 'OK',
      customClass: {
        ...getCommonConfig().customClass,
        confirmButton: '!bg-blue-500 hover:!bg-blue-600 !rounded-lg !px-6 !py-2 !font-semibold',
      },
    }).then(() => {
      onPress?.();
    });
  }
}
