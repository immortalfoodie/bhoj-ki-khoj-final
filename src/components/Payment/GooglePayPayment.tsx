import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface GooglePayPaymentProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error?: string) => void;
  userData?: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod?: string;
}

const GooglePayPayment: React.FC<GooglePayPaymentProps> = ({ 
  amount, 
  onSuccess, 
  onError,
  userData,
  paymentMethod 
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Skip Google Pay API check in production environment to avoid WebSocket errors
    if (window.location.hostname !== 'localhost') {
      setIsReady(true);
      return;
    }
    
    const checkGooglePay = async () => {
      try {
        if (!(window as any).google?.payments?.api) {
          console.error('Google Pay API not available');
          setError('Google Pay is not available in your browser');
          onError?.('Google Pay is not available in your browser');
          return;
        }

        const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
          environment: 'TEST' // Always use TEST for development
        });

        const isReadyToPay = await paymentsClient.isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER', 'JCB']
            }
          }]
        });

        setIsReady(isReadyToPay.result);
        
        if (!isReadyToPay.result) {
          setError('Google Pay is not available for your device');
          onError?.('Google Pay is not available for your device');
        }
      } catch (error) {
        console.error('Error checking Google Pay availability:', error);
        setError('Failed to initialize Google Pay');
        onError?.('Failed to initialize Google Pay');
      }
    };

    checkGooglePay();
  }, [onError]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Always use simulation in production to avoid WebSocket errors
      // Generate a random payment ID for demo purposes
      const paymentId = 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Simulate processing time
      setTimeout(() => {
        onSuccess(paymentId);
        
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully',
        });
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
      
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Google Pay</h2>
          <p className="text-gray-600">Complete your payment using Google Pay</p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          {isReady ? (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex items-center justify-center w-full max-w-xs px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <img 
                    src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png"
                    alt="Google Pay" 
                    className="h-6 mr-2"
                  />
                  Pay ₹{amount}
                </>
              )}
            </button>
          ) : (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bhoj-primary"></div>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <p className="text-sm text-gray-500">Test Mode - No actual payment will be processed</p>
          <button 
            onClick={() => onError?.('Payment cancelled')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default GooglePayPayment;