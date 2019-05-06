/* DO NOT EDIT THIS FILE - it is machine generated */
#include <jni.h>
/* Header for class quantumx_HidConnection */

#ifndef _Included_quantumx_HidConnection
#define _Included_quantumx_HidConnection
#ifdef __cplusplus
extern "C" {
#endif
/*
 * Class:     quantumx_HidConnection
 * Method:    open
 * Signature: ()[Ljava/lang/String;
 */
JNIEXPORT jobjectArray JNICALL Java_quantumx_HidConnection_open
  (JNIEnv *, jobject);

/*
 * Class:     quantumx_HidConnection
 * Method:    receiveMessage
 * Signature: (SI)[B
 */
JNIEXPORT jbyteArray JNICALL Java_quantumx_HidConnection_receiveMessage
  (JNIEnv *, jobject, jshort, jint);

/*
 * Class:     quantumx_HidConnection
 * Method:    sendMessage
 * Signature: (S[BI)Z
 */
JNIEXPORT jboolean JNICALL Java_quantumx_HidConnection_sendMessage
  (JNIEnv *, jobject, jshort, jbyteArray, jint);

#ifdef __cplusplus
}
#endif
#endif