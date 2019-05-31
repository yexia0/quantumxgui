#include "quantumx_HidConnection.h"
#include "hid.h"
#include <stdio.h>
#include <limits.h>


JNIEXPORT jboolean JNICALL Java_quantumx_HidConnection_open
  (JNIEnv *env, jobject obj) {
    rawhid_open(10, 0x16C0, 0x27DB, -1, -1);
    return 1;
}

#define DEVICE_LIMIT 10
JNIEXPORT jobjectArray JNICALL Java_quantumx_HidConnection_getDevices
  (JNIEnv *env, jobject obj) {
    jshortArray ret;
    const char* result[DEVICE_LIMIT];
    int count = get_devices(result, DEVICE_LIMIT);
    ret = (jobjectArray)(*env)->NewObjectArray(env, count, (*env)->FindClass(env, "java/lang/String"), (*env)->NewStringUTF(env, ""));
    for (int i = 0; i < count; i++) {
        (*env)->SetObjectArrayElement(env, ret, i, (*env)->NewStringUTF(env, result[i]));
    }
    return(ret);
}

#define BUF_SIZE 64
JNIEXPORT jbyteArray JNICALL Java_quantumx_HidConnection_receiveMessage
  (JNIEnv *env, jobject obj, jstring device_id, jint timeout) {
    jbyteArray ret;
    jbyte buf[BUF_SIZE];

    int rc = rawhid_recv((*env)->GetStringUTFChars(env, device_id, 0), COMMAND, buf, BUF_SIZE, timeout);
    if (rc != BUF_SIZE) {
        printf("unexpected size: %d\n", rc);
        fflush(stdout);
        return 0;
    }
    ret = (*env)->NewByteArray(env, BUF_SIZE);
    (*env)->SetByteArrayRegion(env, ret, 0, BUF_SIZE, buf);
    return ret;
}


JNIEXPORT jboolean JNICALL Java_quantumx_HidConnection_sendMessage
  (JNIEnv *env, jobject obj, jstring device_id, jbyteArray msg, jint timeout) {
    int arrSize = (*env)->GetArrayLength(env, msg);
    if (arrSize != BUF_SIZE) {
        printf("Only 64 bytes segment can be sent");
        fflush(stdout);
        return (jboolean)0;
    }
    jbyte *buf = (*env)->GetByteArrayElements(env, msg, 0);
    int rc = rawhid_send((*env)->GetStringUTFChars(env, device_id, 0), COMMAND, buf, BUF_SIZE, timeout);
    if (rc == -1) {
        return (jboolean)0;
    } else {
        return (jboolean)1;
    }
}

JNIEXPORT jbyteArray JNICALL Java_quantumx_HidConnection_getConsoleLog
  (JNIEnv *env, jobject obj, jstring device_id, jint timeout) {
    jbyteArray ret;
    jbyte buf[BUF_SIZE];
    const char *s = (*env)->GetStringUTFChars(env, device_id, 0);
    int rc = rawhid_recv((*env)->GetStringUTFChars(env, device_id, 0), CONSOLE, buf, BUF_SIZE, timeout);

    if (rc == 0) {
        return 0;
    }
    if (rc < 0) {
        (*env)->ThrowNew(env, (*env)->FindClass(env, "java/lang/Exception"), "No device");
        return 0;
    }
    ret = (*env)->NewByteArray(env, rc);
    (*env)->SetByteArrayRegion(env, ret, 0, rc, buf);
    return ret;
 }

JNIEXPORT void JNICALL Java_quantumx_HidConnection_eventLoopForever
  (JNIEnv *env, jobject obj) {
    rawhid_loop_forever();
  }
